const PRODUCT_IMAGE_BY_ID = {
  2: 'freedom.jpg',
  3: 'barbatos.jpg',
  4: 'exia.jpg',
  5: 'unicorn.jpg',
  6: 'wingzero.jpg',
  7: 'redframe.jpg',
  8: 'dynames.jpg',
  9: 'heavyarms.jpg',
  10: 'aerial.jpg',
  11: 'calibarn.jpg',
  12: 'nugundam.jpg',
  13: 'zeta.jpg',
  14: 'providence.jpg',
  15: 'hg_rx782.jpg',
  16: 'hg_barbatos.jpg',
  17: 'hg_aerial_rebuild.jpg',
  18: 'rg_sazabi.jpg',
  19: 'rg_nu.jpg',
  20: 'rg_strike_freedom.jpg',
  21: 'mg_freedom2.jpg',
  22: 'mg_exia.jpg',
  23: 'barbatos.jpg',
  24: 'pg_unicorn.jpg',
  25: 'pg_strike.jpg',
  26: 'rx78.jpg',
  27: 'hg_barbatos.jpg',
  28: 'wingzero.jpg',
};

const productAssetModules = import.meta.glob('../../../assets/products/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const productAssetsByFileName = Object.fromEntries(
  Object.entries(productAssetModules).map(([path, url]) => [path.split('/').pop().toLowerCase(), url])
);

const getAssetUrl = (fileName) => productAssetsByFileName[fileName?.toLowerCase()];

const normalizeImageList = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter(Boolean);

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return images.trim() ? [images.trim()] : [];
    }
  }

  return [];
};

const matchImageByName = (productName) => {
  const normalizedName = String(productName || '').toLowerCase();

  const matches = [
    [/freedom gundam 2\.0/i, 'mg_freedom2.jpg'],
    [/freedom.*hg/i, 'freedom.jpg'],
    [/barbatos lupus/i, 'hg_barbatos.jpg'],
    [/barbatos mg/i, 'barbatos.jpg'],
    [/barbatos$/i, 'barbatos.jpg'],
    [/exia repair ii/i, 'exia.jpg'],
    [/\bexia\b/i, 'mg_exia.jpg'],
    [/unicorn.*destroy/i, 'unicorn.jpg'],
    [/wing zero custom/i, 'wingzero.jpg'],
    [/astray red frame/i, 'redframe.jpg'],
    [/dynames/i, 'dynames.jpg'],
    [/heavyarms/i, 'heavyarms.jpg'],
    [/aerial rebuild/i, 'hg_aerial_rebuild.jpg'],
    [/\baerial\b/i, 'aerial.jpg'],
    [/calibarn/i, 'calibarn.jpg'],
    [/nu rx-93/i, 'nugundam.jpg'],
    [/nu gundam/i, 'rg_nu.jpg'],
    [/\bzeta\b/i, 'zeta.jpg'],
    [/providence/i, 'providence.jpg'],
    [/rx-78-2.*revive/i, 'hg_rx782.jpg'],
    [/sazabi/i, 'rg_sazabi.jpg'],
    [/strike freedom/i, 'rg_strike_freedom.jpg'],
    [/pg gundam unicorn/i, 'pg_unicorn.jpg'],
    [/pg strike gundam/i, 'pg_strike.jpg'],
    [/sd ex-standard rx-78-2/i, 'rx78.jpg'],
    [/sd barbatos lupus/i, 'hg_barbatos.jpg'],
    [/sd wing zero custom/i, 'wingzero.jpg'],
  ];

  for (const [pattern, fileName] of matches) {
    if (pattern.test(normalizedName)) {
      const assetUrl = getAssetUrl(fileName);
      if (assetUrl) return assetUrl;
    }
  }

  return null;
};

export const resolveProductImages = ({ id, name, images } = {}) => {
  const normalizedImages = normalizeImageList(images);
  if (normalizedImages.length > 0) {
    return normalizedImages;
  }

  const idKey = Number(id) || id;
  const imageFromId = getAssetUrl(PRODUCT_IMAGE_BY_ID[idKey]);
  if (imageFromId) {
    return [imageFromId];
  }

  const imageFromName = matchImageByName(name);
  return imageFromName ? [imageFromName] : [];
};
