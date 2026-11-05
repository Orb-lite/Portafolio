import firebaseConfig from '../../firebase-applet-config.json';
import { ensureGsiLoaded } from './authService';

export interface YouTubeVideoMetadata {
  id: string;
  title: string;
  description: string;
  tags: string[];
  localVideoSrc: string;
  thumbnailSrc?: string;
  categoryId: string; // 20: Gaming, 28: Science & Technology
  privacyStatus: 'public' | 'unlisted' | 'private';
  linkedProjectId?: string;
  uploadedVideoId?: string;
  status: 'idle' | 'uploading' | 'completed' | 'error';
  progress: number;
  errorMessage?: string;
}

export interface YouTubeChannelProfile {
  id: string;
  title: string;
  customUrl?: string;
  thumbnailUrl?: string;
}

// In-memory access token cache
let cachedYouTubeToken: string | null = null;
let cachedChannelProfile: YouTubeChannelProfile | null = null;

export const getCachedYouTubeToken = (): string | null => cachedYouTubeToken;
export const getCachedChannelProfile = (): YouTubeChannelProfile | null => cachedChannelProfile;

/**
 * Request OAuth access token with YouTube upload scopes using Google Identity Services (GIS)
 */
export async function authenticateYouTube(): Promise<{ token: string; profile: YouTubeChannelProfile | null }> {
  await ensureGsiLoaded();

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window is not defined'));
    }

    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
      return reject(new Error('Google Identity Services SDK not loaded'));
    }

    const clientId = firebaseConfig.oAuthClientId;
    if (!clientId) {
      return reject(new Error('OAuth Client ID not found in firebase configuration'));
    }

    try {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope:
          'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        prompt: 'consent',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            return reject(new Error(`Google OAuth error: ${tokenResponse.error}`));
          }
          if (!tokenResponse.access_token) {
            return reject(new Error('No access token returned from Google'));
          }

          cachedYouTubeToken = tokenResponse.access_token;

          // Fetch user channel profile
          try {
            const channelRes = await fetch(
              'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
              {
                headers: {
                  Authorization: `Bearer ${cachedYouTubeToken}`,
                },
              }
            );

            if (channelRes.ok) {
              const data = await channelRes.json();
              if (data.items && data.items.length > 0) {
                const item = data.items[0];
                cachedChannelProfile = {
                  id: item.id,
                  title: item.snippet?.title || 'YouTube Channel',
                  customUrl: item.snippet?.customUrl,
                  thumbnailUrl: item.snippet?.thumbnails?.default?.url,
                };
              }
            }
          } catch (e) {
            console.warn('Could not fetch channel profile:', e);
          }

          resolve({ token: tokenResponse.access_token, profile: cachedChannelProfile });
        },
      });

      tokenClient.requestAccessToken();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Upload a local video file from public/portfolio_assets directly to YouTube
 */
export async function uploadToYouTube(
  video: YouTubeVideoMetadata,
  onProgress: (percent: number) => void
): Promise<{ videoId: string; url: string }> {
  const token = cachedYouTubeToken;
  if (!token) {
    throw new Error('No estás autenticado con YouTube. Por favor conecta tu cuenta de Google primero.');
  }

  // 1. Fetch the video binary as Blob
  onProgress(5);
  const videoResponse = await fetch(video.localVideoSrc);
  if (!videoResponse.ok) {
    throw new Error(`No se pudo leer el archivo de video local (${videoResponse.statusText})`);
  }
  const videoBlob = await videoResponse.blob();
  onProgress(15);

  // 2. Metadata payload
  const metadata = {
    snippet: {
      title: video.title.slice(0, 100),
      description: video.description,
      tags: video.tags,
      categoryId: video.categoryId || '20', // Gaming
      defaultLanguage: 'es',
    },
    status: {
      privacyStatus: video.privacyStatus || 'public',
      selfDeclaredMadeForKids: false,
      embeddable: true,
    },
  };

  // 3. Initiate resumable upload session
  const initResponse = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': videoBlob.size.toString(),
        'X-Upload-Content-Type': videoBlob.type || 'video/mp4',
      },
      body: JSON.stringify(metadata),
    }
  );

  if (!initResponse.ok) {
    const errorText = await initResponse.text();
    throw new Error(`Error al iniciar subida en YouTube API: ${initResponse.status} ${errorText}`);
  }

  const uploadUrl = initResponse.headers.get('Location');
  if (!uploadUrl) {
    throw new Error('YouTube no devolvió la URL de subida resumable');
  }

  onProgress(25);

  // 4. Perform upload with XMLHttpRequest to track upload percentage progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', videoBlob.type || 'video/mp4');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        // Map upload progress from 25% to 95%
        const percentComplete = 25 + Math.round((event.loaded / event.total) * 70);
        onProgress(Math.min(percentComplete, 95));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        try {
          const result = JSON.parse(xhr.responseText);
          const videoId = result.id;
          resolve({
            videoId,
            url: `https://youtu.be/${videoId}`,
          });
        } catch (e) {
          reject(new Error('Respuesta inválida de YouTube API'));
        }
      } else {
        reject(new Error(`Fallo en la subida a YouTube: ${xhr.status} ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Error de red durante la subida a YouTube'));
    };

    xhr.send(videoBlob);
  });
}

/**
 * Initial curated portfolio video post templates ready to upload to Isaac's YouTube channel
 */
export const DEFAULT_YOUTUBE_PORTFOLIO_POSTS: YouTubeVideoMetadata[] = [
  {
    id: 'yt-watercolor',
    linkedProjectId: 'watercolor-sim',
    title: 'Acuarela - Stylized Interactive Virtual Environment | Unreal Engine NPR Shaders',
    localVideoSrc: '/portfolio_assets/watercolor-development-viewport.mp4',
    thumbnailSrc: '/portfolio_assets/watercolor-thumb.jpg',
    categoryId: '20', // Gaming / Simulation
    privacyStatus: 'public',
    tags: [
      'Unreal Engine',
      'Technical Artist',
      'HLSL',
      'Shaders',
      'NPR',
      'Post Processing',
      'Game Development',
      'Virtual Environments',
      'Isaac Gomez',
    ],
    description: `Acuarela (Watercolor) - Entorno Virtual Interactivo Estilizado desarrollado en Unreal Engine.
Desarrollado y programado por Isaac Gómez Estrada (Technical Artist / Systems Engineer).

Aspectos Técnicos Destacados:
• Shaders de post-procesamiento en HLSL personalizados con algoritmos de detección de bordes y dispersión de pigmentos de acuarela.
• Navegación fluida y estable a 60+ FPS en build Standalone de 64 bits para Windows.
• Iluminación dinámica en tiempo real, partículas volumétricas en suspensión y profundidad atmosférica.

🌐 Portafolio y Currículum: https://orb-lite.com
💻 Código y Proyectos en GitHub: https://github.com/Orb-lite/Portafolio
🎮 Créditos AAA en MobyGames: https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/
💼 LinkedIn: https://www.linkedin.com/in/isaac-g%C3%B3mez-477002166/
✉️ Contacto: ventas@orb-lite.com

#UnrealEngine #TechnicalArtist #GameDev #HLSL #Shaders #NPR #InteractiveEnvironment`,
    status: 'idle',
    progress: 0,
  },
  {
    id: 'yt-digital-twin',
    linkedProjectId: 'industrial-digital-twins',
    title: 'Industrial Manufacturing Digital Twin Campus | Unreal Engine 5 & FlexSim',
    localVideoSrc: '/portfolio_assets/digital-twin-campus-standalone.mp4',
    thumbnailSrc: '/portfolio_assets/digital-twin-campus-thumb.jpg',
    categoryId: '28', // Science & Tech
    privacyStatus: 'public',
    tags: [
      'Digital Twin',
      'Unreal Engine 5',
      'FlexSim',
      'Industrial IoT',
      'Smart Factory',
      'Technical Artist',
      'Industry 4.0',
      'Automation',
    ],
    description: `Gemelo Digital 3D en tiempo real para instalaciones de manufactura industrial y líneas de producción automotriz / alta tecnología.
Desarrollado en Unreal Engine 5, DirectX Shader Model 6 y Arch FlexSim por Isaac Gómez Estrada.

Capacidades del Sistema:
• Navegación interactiva de campus completo (Campus Guadalajara Norte) y monitoreo de edificios industriales (B29).
• Telemetría de maquinaria en vivo: SIPLACE, AOI Zenith, Vitrox y Horno de Reflujo Heller con triage de fallas.
• Integración de sensores telemáticos IoT en tiempo real: temperatura, humedad, energía, agua y consumo de nitrógeno.
• Dashboard de consumo energético por edificio y estación de trabajo multi-monitor de telemetría.

🌐 Portafolio: https://orb-lite.com
💻 GitHub: https://github.com/Orb-lite/Portafolio
💼 LinkedIn: https://www.linkedin.com/in/isaac-g%C3%B3mez-477002166/
✉️ Contacto: ventas@orb-lite.com

#DigitalTwin #UnrealEngine5 #FlexSim #IndustrialIoT #SmartManufacturing #Industry40 #TechnicalArt`,
    status: 'idle',
    progress: 0,
  },
  {
    id: 'yt-unreal-multiplayer',
    linkedProjectId: 'unreal-editor-multiplayer',
    title: 'Unreal Engine Dedicated Server & Multiplayer Architecture | PCD3D_SM5 Preview',
    localVideoSrc: '/portfolio_assets/unreal-multiplayer-server-preview.mp4',
    thumbnailSrc: '/portfolio_assets/unreal-multiplayer-thumb.jpg',
    categoryId: '20', // Gaming
    privacyStatus: 'public',
    tags: [
      'Unreal Engine',
      'Multiplayer',
      'Dedicated Server',
      'Networking',
      'Game Development',
      'C++',
      'Blueprints',
      'Technical Artist',
    ],
    description: `Simulación multijugador con arquitectura de servidor dedicado en Unreal Engine probando replicación de cliente a servidor en tiempo real.
Desarrollado por Isaac Gómez Estrada.

Aspectos Técnicos:
• Físicas con servidor autoritativo, interpolación suave de posiciones y llamadas a procedimientos remotos (RPCs).
• Depuración simultánea en múltiples ventanas con clientes sincronizados en red local y remota.
• Herramientas de depuración de red y perfilado de rendimiento en Unreal Editor.

🌐 Portafolio: https://orb-lite.com
💻 Repositorio GitHub: https://github.com/Orb-lite/Portafolio
💼 Perfil Profesional: https://www.linkedin.com/in/isaac-g%C3%B3mez-477002166/
✉️ Contacto: ventas@orb-lite.com

#UnrealEngine #Multiplayer #DedicatedServer #Networking #GameDev #CPlusPlus #Blueprints`,
    status: 'idle',
    progress: 0,
  },
  {
    id: 'yt-scores-cfb25',
    linkedProjectId: 'scores-sports-sim',
    title: 'EA Sports College Football 25 | Dynasty Hub UI & Real-Time Scorebug HUD Debug',
    localVideoSrc: '/portfolio_assets/scores-cfb25-debug.mp4',
    thumbnailSrc: '/portfolio_assets/scores-cfb25-thumb.jpg',
    categoryId: '20', // Gaming
    privacyStatus: 'public',
    tags: [
      'EA Sports',
      'Frostbite Engine',
      'ActionScript',
      'C++',
      'College Football 25',
      'UI/UX',
      'Technical Art',
      'Game Development',
      'Scoreboard',
      'MobyGames',
    ],
    description: `Grabación directa in-engine de depuración de sistemas UI/UX y máquina de estados de marcador deportivo para EA Sports College Football 25.
Desarrollado y testeado por Isaac Gómez Estrada (créditos verificados en MobyGames).

Aspectos Técnicos Destacados:
• Desarrollo de máquina de estados para scorebug deportivo en ActionScript y runtime C++ de alto rendimiento sobre Frostbite Engine.
• Paneles de depuración Dynasty Hub UI (ScreenKey, mcScreenManager, jerarquía de pantallas y gráfico de frametime en tiempo real).
• Sincronización cuadro a cuadro de reloj de juego, cuartos/tiempos y transiciones visuales broadcast-grade.
• Optimización y certificación para consolas PlayStation 5 y Xbox Series X/S.

🌐 Portafolio y Bio: https://orb-lite.com
🎮 Créditos Verificados MobyGames: https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/
💻 Repositorio GitHub: https://github.com/Orb-lite/Portafolio
💼 LinkedIn: https://www.linkedin.com/in/isaac-g%C3%B3mez-477002166/
✉️ Contacto: ventas@orb-lite.com

#EASports #CollegeFootball25 #FrostbiteEngine #GameDevelopment #TechnicalArtist #GameDev #ActionScript #CPlusPlus #MobyGames`,
    status: 'idle',
    progress: 0,
  },
  {
    id: 'yt-vdb-realestate',
    linkedProjectId: 'vdb-realestate-digitaltwin',
    title: 'Interactive 3D Architectural Master Plan & Day/Night Sun Simulation | Unreal Engine',
    localVideoSrc: '/portfolio_assets/vdb-realestate-digitaltwin.mp4',
    thumbnailSrc: '/portfolio_assets/vdb-realestate-thumb.jpg',
    categoryId: '28', // Science & Tech
    privacyStatus: 'public',
    tags: [
      'Unreal Engine',
      'Architectural Visualization',
      'Digital Twin',
      'ArchViz',
      'Real Estate',
      'Interactive 3D',
      'Technical Art',
      'Lighting Simulation',
    ],
    description: `Visualización 3D interactiva y gemelo digital arquitectónico para desarrollos inmobiliarios verticales de lujo.
Desarrollado por Isaac Gómez Estrada en Unreal Engine.

Aspectos Técnicos:
• Simulación interactiva de trayectoria solar con ciclo dinámico día/noche y encendido volumétrico de luces interiores/exteriores.
• HUD interactivo con brújula de orientación, master plan de niveles, zonificación y localizador de amenidades urbanas circundantes (Andares, Hospital Puerta de Hierro).
• Optimizado para navegación fluida a 60 FPS con vegetación densa y entorno metropolitano realista.

🌐 Portafolio: https://orb-lite.com
💻 GitHub: https://github.com/Orb-lite/Portafolio
💼 LinkedIn: https://www.linkedin.com/in/isaac-g%C3%B3mez-477002166/
✉️ Contacto: ventas@orb-lite.com

#UnrealEngine #ArchViz #DigitalTwin #RealEstate #ArchitecturalVisualization #Interactive3D #DayNightCycle`,
    status: 'idle',
    progress: 0,
  },
  {
    id: 'yt-goblins-castle',
    linkedProjectId: 'goblins-castle',
    title: 'Goblins Castle - Medieval Dark Fantasy Action RPG Gameplay | Unreal Engine 64-bit',
    localVideoSrc: '/portfolio_assets/goblins-castle-gameplay.mp4',
    thumbnailSrc: '/portfolio_assets/goblins-castle-thumb.jpg',
    categoryId: '20', // Gaming
    privacyStatus: 'public',
    tags: [
      'Unreal Engine',
      'Action RPG',
      'Dark Fantasy',
      'Game Mechanics',
      'Indie Game Dev',
      'Third Person',
      'Combat System',
    ],
    description: `Prototipo de RPG de acción y fantasía oscura medieval en tercera persona desarrollado en Unreal Engine (build 64-bit Development PCD3D_SM5).
Desarrollado por Isaac Gómez Estrada.

Aspectos Técnicos:
• Locomoción en tercera persona, combos de combate con espada, esquive reactivo y feedback de daño.
• Iluminación dinámica de antorchas en DirectX Shader Model 5 y sombras volumétricas en mazmorras.
• HUD interactivo con alertas de objetivos de misión, experiencia (Exp) y barras de salud.
• IA de enemigos reactivos con comportamientos de patrulla y combate cuerpo a cuerpo.

🌐 Portafolio: https://orb-lite.com
💻 GitHub: https://github.com/Orb-lite/Portafolio
💼 LinkedIn: https://www.linkedin.com/in/isaac-g%C3%B3mez-477002166/
✉️ Contacto: ventas@orb-lite.com

#UnrealEngine #ActionRPG #DarkFantasy #GameMechanics #IndieGameDev #ThirdPerson #CombatSystem`,
    status: 'idle',
    progress: 0,
  },
  {
    id: 'yt-unreal-landscape',
    linkedProjectId: 'procedural-world-gen',
    title: 'Open World RPG Exploration & Dynamic Landscape | Unreal Engine (IWG Studios)',
    localVideoSrc: '/portfolio_assets/unreal-landscape-openworld.mp4',
    thumbnailSrc: '/portfolio_assets/unreal-landscape-thumb.jpg',
    categoryId: '20', // Gaming
    privacyStatus: 'public',
    tags: [
      'Unreal Engine',
      'Open World',
      'Landscape',
      'RPG',
      'Level Design',
      'Foliage',
      'Game Development',
    ],
    description: `Exploración RPG en tercera persona en entorno de mundo abierto medieval y patio de castillo.
Desarrollado en Unreal Engine por Isaac Gómez Estrada (IWG Studios).

Aspectos Técnicos:
• Generación y renderizado de paisaje a gran escala con biomas de terreno y vegetación dinámica con viento.
• Sistema de misiones en tiempo real en HUD ('Misiones: Compra una espada').
• Locomoción en tercera persona con física de caída, salto e interacción espacial con el entorno.

🌐 Portafolio: https://orb-lite.com
💻 GitHub: https://github.com/Orb-lite/Portafolio
💼 LinkedIn: https://www.linkedin.com/in/isaac-g%C3%B3mez-477002166/
✉️ Contacto: ventas@orb-lite.com

#UnrealEngine #OpenWorld #RPG #Landscape #GameDev #ThirdPerson #LevelDesign`,
    status: 'idle',
    progress: 0,
  },
  {
    id: 'yt-devbot-gamejam',
    linkedProjectId: 'gamejam-devbot',
    title: 'DevBot Game Jam - Rapid Action Prototype & Dungeon Combat | NetMode Standalone',
    localVideoSrc: '/portfolio_assets/devbot-gamejam-combat.mp4',
    thumbnailSrc: '/portfolio_assets/devbot-gamejam-thumb.jpg',
    categoryId: '20', // Gaming
    privacyStatus: 'public',
    tags: [
      'Unreal Engine',
      'Game Jam',
      'DevBot',
      'Combat Mechanics',
      'Rapid Prototyping',
      'Action Game',
    ],
    description: `Prototipo de acción ágil y combate en mazmorra desarrollado en el Game Jam del estudio DEVBOT.
Desarrollado por Isaac Gómez Estrada.

Aspectos Técnicos:
• Empaquetado y probado como ejecutable NetMode Standalone de 64 bits para Windows.
• Combate ágil contra espectros y enemigos de mazmorra con armas cuerpo a cuerpo.
• Físicas de locomoción responsiva y navegación de obstáculos completado bajo estricto plazo de jam.

🌐 Portafolio: https://orb-lite.com
💻 GitHub: https://github.com/Orb-lite/Portafolio
💼 LinkedIn: https://www.linkedin.com/in/isaac-g%C3%B3mez-477002166/
✉️ Contacto: ventas@orb-lite.com

#UnrealEngine #GameJam #DEVBOT #GameDev #ActionGame #Prototyping`,
    status: 'idle',
    progress: 0,
  },
  {
    id: 'yt-watercolor-sim',
    linkedProjectId: 'watercolor-sim',
    title: 'Acuarela - Stylized Interactive Virtual Environment | Unreal Engine NPR Shaders',
    localVideoSrc: '/portfolio_assets/watercolor-development-viewport.mp4',
    thumbnailSrc: '/portfolio_assets/watercolor-thumb.jpg',
    categoryId: '20',
    privacyStatus: 'public',
    tags: [
      'Unreal Engine',
      'Technical Artist',
      'HLSL',
      'Shaders',
      'NPR',
      'Post Processing',
      'Game Development',
    ],
    description: `Acuarela (Watercolor) - Entorno Virtual Interactivo Estilizado desarrollado en Unreal Engine.
Desarrollado y programado por Isaac Gómez Estrada (Technical Artist / Systems Engineer).

🌐 Portafolio: https://orb-lite.com
💻 GitHub: https://github.com/Orb-lite/Portafolio
💼 LinkedIn: https://www.linkedin.com/in/isaac-g%C3%B3mez-477002166/
✉️ Contacto: ventas@orb-lite.com

#UnrealEngine #TechnicalArtist #GameDev #HLSL #Shaders #NPR`,
    status: 'idle',
    progress: 0,
  },
  {
    id: 'yt-digital-twin',
    linkedProjectId: 'industrial-digital-twins',
    title: 'Industrial Manufacturing Digital Twin Campus | Unreal Engine 5 & FlexSim',
    localVideoSrc: '/portfolio_assets/digital-twin-campus-standalone.mp4',
    thumbnailSrc: '/portfolio_assets/digital-twin-campus-thumb.jpg',
    categoryId: '28',
    privacyStatus: 'public',
    tags: [
      'Digital Twin',
      'Unreal Engine 5',
      'FlexSim',
      'Industrial IoT',
      'Smart Factory',
      'Technical Artist',
    ],
    description: `Gemelo Digital 3D en tiempo real para instalaciones de manufactura industrial Flex.
Desarrollado en Unreal Engine 5, DirectX Shader Model 6 y Arch FlexSim por Isaac Gómez Estrada.

🌐 Portafolio: https://orb-lite.com
💻 GitHub: https://github.com/Orb-lite/Portafolio
💼 LinkedIn: https://www.linkedin.com/in/isaac-g%C3%B3mez-477002166/
✉️ Contacto: ventas@orb-lite.com

#DigitalTwin #UnrealEngine5 #FlexSim #IndustrialIoT #SmartManufacturing`,
    status: 'idle',
    progress: 0,
  },
  {
    id: 'yt-class-sim',
    linkedProjectId: 'class-sim',
    title: 'ClassSim - Interactive 3D Educational Classroom Simulation | Unreal Engine',
    localVideoSrc: '/portfolio_assets/class-sim-interactive-classroom.mp4',
    thumbnailSrc: '/portfolio_assets/class-sim-thumb.jpg',
    categoryId: '28', // Science & Tech
    privacyStatus: 'public',
    tags: [
      'Unreal Engine',
      'Educational Simulation',
      'Interactive 3D',
      'Biology',
      'Virtual Classroom',
      'EdTech',
      'Technical Artist',
    ],
    description: `Simulación interactiva 3D de aula virtual para educación en ciencias y biología en Unreal Engine.
Desarrollado por Isaac Gómez Estrada.

Aspectos Técnicos Destacados:
• Reproducción y sincronización de lecciones en video streaming sobre pizarra digital del aula.
• Vitrinas interactivas 3D con modelos holográficos biológicos (Gametos, Fecundación, Reproducción Asexual y Sexual).
• Controlador interactivo en primera persona con selección por retícula y tarjetas didácticas dinámicas.
• Build ejecutable NetMode Standalone de 64 bits para Windows optimizado para PCs escolares y capacitación remota.

🌐 Portafolio: https://orb-lite.com
💻 GitHub: https://github.com/Orb-lite/Portafolio
💼 LinkedIn: https://www.linkedin.com/in/isaac-g%C3%B3mez-477002166/
✉️ Contacto: ventas@orb-lite.com

#UnrealEngine #EdTech #VirtualClassroom #Interactive3D #Simulation #Biology #TechnicalArtist`,
    status: 'idle',
    progress: 0,
  },
];
