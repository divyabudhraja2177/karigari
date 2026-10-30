import { ImageSourcePropType } from 'react-native';

export const localProductImages: Record<string, ImageSourcePropType> = {
  'prod-1': require('../../assets/products/kantha_pouch.jpg'),
  'prod-2': require('../../assets/products/ajrakh_sleeve.jpg'),
  'prod-3': require('../../assets/products/jute_tote.jpg'),
  'prod-4': require('../../assets/products/kalamkari_clutch.jpg'),
};

export interface ProductVisualSpec {
  id: string;
  name: string;
  hindiName: string;
  category: string;
  craftHeritage: string;
  craftHeritageHindi: string;
  pieceRate: number;
  estimatedHours: string;
  image: ImageSourcePropType;
  dimensions: string;
  description: string;
  hindiDescription: string;
  technique: string;
  techniqueHindi: string;
  materials: string[];
  materialsHindi: string[];
}

export const curatedProductVisuals: ProductVisualSpec[] = [
  {
    id: 'prod-1',
    name: 'Kantha Embroidered Artisan Pouch',
    hindiName: 'कांथा कशीदाकारी ज़िपर पाउच',
    category: 'Pouch',
    craftHeritage: 'Bengal Kantha Running Stitch',
    craftHeritageHindi: 'पारंपरिक बंगाली कांथा हस्तशिल्प',
    pieceRate: 140,
    estimatedHours: '1.5 hrs',
    image: localProductImages['prod-1'],
    dimensions: '8" × 5" × 2"',
    description: 'Multi-utility zip pouch with traditional Bengali Kantha running hand-stitch, organic cotton lining, and brass hardware.',
    hindiDescription: 'पारंपरिक कांथा हाथ की बारीक कढ़ाई, शुद्ध सूती अस्तर और पीतल की मजबूत ज़िप वाला कलात्मक पाउच।',
    technique: 'Double running hand-stitch on handloom cotton with thread tassel pull',
    techniqueHindi: 'हथकरघा सूती कपड़े पर दोहरा रनिंग स्टिच और हाथ से बुना धागे का लटकन',
    materials: ['Handloom Cotton Canvas', 'Brass Metal Zip', 'Anchor Thread Skeins', 'Organic Cotton Lining'],
    materialsHindi: ['हथकरघा कॉटन कैनवास', 'पीतल की धातु ज़िप', 'एंकर कढ़ाई के धागे', 'प्राकृतिक कॉटन अस्तर']
  },
  {
    id: 'prod-2',
    name: 'Ajrakh Block-Print Laptop Sleeve',
    hindiName: 'अजरक ब्लॉक प्रिंट लैपटॉप स्लीव',
    category: 'Laptop Sleeve',
    craftHeritage: 'Kutch Natural-Dye Ajrakh',
    craftHeritageHindi: 'कच्छ की प्राकृतिक अजरक छपाई',
    pieceRate: 290,
    estimatedHours: '3.0 hrs',
    image: localProductImages['prod-2'],
    dimensions: '14" × 10" (Fits 13-14" laptops)',
    description: 'Padded laptop sleeve with authentic natural dyed Ajrakh block print fabric and quilted shock-absorbent lining.',
    hindiDescription: 'प्राकृतिक नील और मजीठ रंगों से ब्लॉक-प्रिंटेड अजरक कपड़े और शॉक-प्रूफ कुशन अस्तर वाली लैपटॉप स्लीव।',
    technique: '1-inch diamond quilted pattern with reinforced edge piping and dual zipper',
    techniqueHindi: '1 इंच डायमंड क्विल्टिंग पैटर्न, मजबूत किनारी पाइपिंग और डबल ज़िप',
    materials: ['Ajrakh Hand-Block Cotton', 'Quilted Foam Interfacing', 'Heavy Nylon Zipper', 'Soft Inner Microfiber'],
    materialsHindi: ['अजरक हैंड-ब्लॉक कपड़ा', 'क्विल्टेड फोम इंटरफेसिंग', 'मजबूत नायलॉन ज़िप', 'सॉफ्ट इनर लाइनिंग']
  },
  {
    id: 'prod-3',
    name: 'Jute-Cotton Heritage Tote Bag',
    hindiName: 'जूट-कॉटन हेरिटेज टोट बैग',
    category: 'Tote Bag',
    craftHeritage: 'Bengal Golden Fiber & Canvas',
    craftHeritageHindi: 'बंगाल गोल्डन जूट व हथकरघा कैनवास',
    pieceRate: 240,
    estimatedHours: '2.5 hrs',
    image: localProductImages['prod-3'],
    dimensions: '16" × 14" × 5"',
    description: 'Sturdy everyday tote bag handcrafted from eco-friendly golden jute and cotton canvas with internal zipper pocket.',
    hindiDescription: 'पर्यावरण-अनुकूल मजबूत गोल्डन जूट व कॉटन कैनवास टोट बैग, अंदर ज़िप वाली गुप्त जेब सहित।',
    technique: 'Box-X reinforced handle stitch rated for 10kg bearing with interior divider',
    techniqueHindi: '10 किलो वजन उठाने के लिए बॉक्स-X मजबूत हैंडल सिलाई और आंतरिक कम्पार्टमेंट',
    materials: ['Golden Jute Canvas Blend', 'Heavy Cotton Webbing Straps', 'Brass Zipper', 'Organic Canvas Base'],
    materialsHindi: ['गोल्डन जूट-कैनवास मिश्रण', 'मजबूत कॉटन पट्टे', 'पीतल की ज़िप', 'कैनवास बॉटम']
  },
  {
    id: 'prod-4',
    name: 'Kalamkari Hand-Block Zipper Clutch',
    hindiName: 'कलमकारी हैंड-ब्लॉक ज़िपर क्लच',
    category: 'Clutch',
    craftHeritage: 'Andhra Botanical Kalamkari',
    craftHeritageHindi: 'आंध्र प्रदेश कलमकारी वनस्पति कला',
    pieceRate: 190,
    estimatedHours: '2.0 hrs',
    image: localProductImages['prod-4'],
    dimensions: '9" × 5.5"',
    description: 'Compact travel clutch featuring Andhra Kalamkari hand-block botanical and peacock motifs with wristlet strap.',
    hindiDescription: 'आंध्र की पारंपरिक कलमकारी मयूर व वनस्पति रूपांकनों वाला खूबसूरत ट्रैवल क्लच और रिस्टलेट स्ट्रैप।',
    technique: 'Hand-aligned floral border with concealed seams and detachable brass swivel wristlet',
    techniqueHindi: 'हाथ से संरेखित फ्लोरल बॉर्डर, अदृश्य सीम और डिटैचेबल ब्रास रिस्टलेट',
    materials: ['Kalamkari Botanical Cotton', 'Solid Brass Zip Pull', 'Swivel Clip Hardware', 'Cotton Twill Lining'],
    materialsHindi: ['कलमकारी वनस्पति कॉटन', 'सॉलिड ब्रास ज़िप', 'स्विवेल क्लिप रिंग', 'कॉटन ट्विल अस्तर']
  }
];

export function getProductImage(productId?: string, category?: string, fallbackUri?: string): ImageSourcePropType {
  if (productId && localProductImages[productId]) {
    return localProductImages[productId];
  }

  // Fallback by category
  if (category) {
    const cat = category.toLowerCase();
    if (cat.includes('pouch')) return localProductImages['prod-1'];
    if (cat.includes('sleeve') || cat.includes('laptop')) return localProductImages['prod-2'];
    if (cat.includes('tote') || cat.includes('bag')) return localProductImages['prod-3'];
    if (cat.includes('clutch')) return localProductImages['prod-4'];
  }

  if (fallbackUri) {
    return { uri: fallbackUri };
  }

  return localProductImages['prod-1'];
}

export function getProductSpec(productId?: string, category?: string): ProductVisualSpec {
  if (productId) {
    const found = curatedProductVisuals.find((p) => p.id === productId);
    if (found) return found;
  }
  if (category) {
    const cat = category.toLowerCase();
    const found = curatedProductVisuals.find((p) => p.category.toLowerCase().includes(cat));
    if (found) return found;
  }
  return curatedProductVisuals[0];
}
