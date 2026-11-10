// Web-compatible Rewarded Ads interface
// In Web / Browser environments, the game delegates to the interactive HTTPS Ad Viewer (WebAdViewerModal)
export function hasNativeRewardedAds(): boolean {
  return false;
}

export function initializeRewardedAds(): Promise<boolean> {
  return Promise.resolve(false);
}

export async function showRewardedLifeAd(): Promise<boolean> {
  return false;
}
