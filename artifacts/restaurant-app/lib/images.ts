export const FOOD_IMAGES: Record<string, any> = {
  burger: require("@/assets/images/burger.png"),
  pizza: require("@/assets/images/pizza.png"),
  chicken: require("@/assets/images/chicken.png"),
  salad: require("@/assets/images/salad.png"),
  sushi: require("@/assets/images/sushi.png"),
  shawarma: require("@/assets/images/shawarma.png"),
};

export const HERO_BANNER = require("@/assets/images/hero-banner.png");
export const APP_ICON = require("@/assets/images/icon.png");

export function getFoodImage(key: string): any {
  return FOOD_IMAGES[key] ?? FOOD_IMAGES["burger"];
}

export const IMAGE_KEYS = Object.keys(FOOD_IMAGES);
