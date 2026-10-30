import { Artisan, Product, Order, WorkingHourEntry, EarningRecord, Material, MaterialRequest, Survey, SurveyResponse, User } from '../types';

export const initialArtisans: Artisan[] = [
  {
    id: 'art-1',
    artisanCode: 'KRG-MUM-01',
    name: 'Sunita Sharma',
    hindiName: 'सुनीता शर्मा',
    city: 'Mumbai',
    area: 'Dharavi Craft Cluster',
    ngoPartner: 'Shakti Foundation Mumbai',
    joiningDate: '2025-08-10',
    phone: '9820145672',
    status: 'active',
    totalCompletedOrders: 28,
    recordedHours: 342,
    monthlyEarnings: 12450,
    baselineMonthlyIncome: 3200,
    currentMonthlyIncome: 12450,
    bankAccountActive: true,
    financialConfidenceScore: 5,
    householdDecisionMaking: 'independent',
    skills: ['Kantha Embroidery', 'Quilted Pouches', 'Finishing & Zips'],
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-2',
    artisanCode: 'KRG-DEL-02',
    name: 'Fatima Ansari',
    hindiName: 'फातिमा अंसारी',
    city: 'Delhi',
    area: 'Hazrat Nizamuddin Basti',
    ngoPartner: 'SEWA Delhi',
    joiningDate: '2025-09-01',
    phone: '9811234589',
    status: 'active',
    totalCompletedOrders: 34,
    recordedHours: 395,
    monthlyEarnings: 14200,
    baselineMonthlyIncome: 2800,
    currentMonthlyIncome: 14200,
    bankAccountActive: true,
    financialConfidenceScore: 5,
    householdDecisionMaking: 'independent',
    skills: ['Zardozi Work', 'Laptop Sleeves', 'Fine Stitching'],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-3',
    artisanCode: 'KRG-DEL-03',
    name: 'Meena Devi',
    hindiName: 'मीना देवी',
    city: 'Delhi',
    area: 'Sundar Nagari Craft Hub',
    ngoPartner: 'SEWA Delhi',
    joiningDate: '2025-10-15',
    phone: '9873412098',
    status: 'active',
    totalCompletedOrders: 22,
    recordedHours: 290,
    monthlyEarnings: 10800,
    baselineMonthlyIncome: 3500,
    currentMonthlyIncome: 10800,
    bankAccountActive: true,
    financialConfidenceScore: 4,
    householdDecisionMaking: 'joint',
    skills: ['Block Print Patchwork', 'Tote Bags', 'Lining Stitching'],
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-4',
    artisanCode: 'KRG-MUM-04',
    name: 'Laxmi Kamble',
    hindiName: 'लक्ष्मी कांबले',
    city: 'Mumbai',
    area: 'Chembur East',
    ngoPartner: 'Shakti Foundation Mumbai',
    joiningDate: '2025-11-20',
    phone: '9892019843',
    status: 'active',
    totalCompletedOrders: 19,
    recordedHours: 245,
    monthlyEarnings: 9600,
    baselineMonthlyIncome: 2400,
    currentMonthlyIncome: 9600,
    bankAccountActive: true,
    financialConfidenceScore: 4,
    householdDecisionMaking: 'joint',
    skills: ['Canvas Tote Bags', 'Heavy Duty Stitching', 'Strap Attachment'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-5',
    artisanCode: 'KRG-DEL-05',
    name: 'Rekha Prajapati',
    hindiName: 'रेखा प्रजापति',
    city: 'Delhi',
    area: 'Okhla Village',
    ngoPartner: 'SEWA Delhi',
    joiningDate: '2026-01-10',
    phone: '9818902345',
    status: 'active',
    totalCompletedOrders: 15,
    recordedHours: 210,
    monthlyEarnings: 8400,
    baselineMonthlyIncome: 3000,
    currentMonthlyIncome: 8400,
    bankAccountActive: true,
    financialConfidenceScore: 4,
    householdDecisionMaking: 'joint',
    skills: ['Handloom Zipper Pouches', 'Edge Binding', 'Coin Purses'],
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-6',
    artisanCode: 'KRG-MUM-06',
    name: 'Shanti Gaikwad',
    hindiName: 'शांति गायकवाड़',
    city: 'Mumbai',
    area: 'Govandi Artisan Colony',
    ngoPartner: 'Shakti Foundation Mumbai',
    joiningDate: '2025-07-15',
    phone: '9833451290',
    status: 'active',
    totalCompletedOrders: 31,
    recordedHours: 410,
    monthlyEarnings: 13900,
    baselineMonthlyIncome: 4100,
    currentMonthlyIncome: 13900,
    bankAccountActive: true,
    financialConfidenceScore: 5,
    householdDecisionMaking: 'independent',
    skills: ['Ajrakh Quilted Sleeves', 'Master Cutting', 'Pattern Making'],
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-7',
    artisanCode: 'KRG-DEL-07',
    name: 'Anjum Bano',
    hindiName: 'अंजुम बानो',
    city: 'Delhi',
    area: 'Seelampur Textile Pocket',
    ngoPartner: 'SEWA Delhi',
    joiningDate: '2026-02-05',
    phone: '9810456123',
    status: 'active',
    totalCompletedOrders: 12,
    recordedHours: 180,
    monthlyEarnings: 7800,
    baselineMonthlyIncome: 2600,
    currentMonthlyIncome: 7800,
    bankAccountActive: true,
    financialConfidenceScore: 4,
    householdDecisionMaking: 'joint',
    skills: ['Kantha Hand Embroidery', 'Floral Motifs', 'Thread Work'],
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-8',
    artisanCode: 'KRG-MUM-08',
    name: 'Savitri Bai',
    hindiName: 'सावित्री बाई',
    city: 'Mumbai',
    area: 'Kurla West Handcraft Center',
    ngoPartner: 'Shakti Foundation Mumbai',
    joiningDate: '2025-09-18',
    phone: '9869234510',
    status: 'active',
    totalCompletedOrders: 26,
    recordedHours: 320,
    monthlyEarnings: 11600,
    baselineMonthlyIncome: 3800,
    currentMonthlyIncome: 11600,
    bankAccountActive: true,
    financialConfidenceScore: 5,
    householdDecisionMaking: 'independent',
    skills: ['Cotton Cushion Covers', 'Heritage Totes', 'Zipper Assemblies'],
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Kantha Embroidered Artisan Pouch',
    hindiName: 'कांथा कशीदाकारी ज़िपर पाउच',
    category: 'Pouch',
    pieceRate: 140,
    description: 'Multi-utility zip pouch with traditional Bengali Kantha running hand-stitch and organic cotton lining.',
    hindiDescription: 'पारंपरिक कांथा हाथ की कढ़ाई और सूती अस्तर वाला उपयोगी ज़िपर पाउच।',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
    estimatedHoursPerUnit: 1.5,
    requiredMaterials: ['Handloom Cotton Fabric', 'Brass Metal Zip', 'Anchor Embroidery Skeins', 'Organic Cotton Lining']
  },
  {
    id: 'prod-2',
    name: 'Ajrakh Block-Print Laptop Sleeve',
    hindiName: 'अजरक ब्लॉक प्रिंट लैपटॉप स्लीव',
    category: 'Laptop Sleeve',
    pieceRate: 290,
    description: 'Padded laptop sleeve with authentic natural dyed Ajrakh block print fabric and quilted shock-absorbent lining.',
    hindiDescription: 'प्राकृतिक रंगों से ब्लॉक-प्रिंटेड अजरक कपड़े और कुशन अस्तर वाली लैपटॉप स्लीव।',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    estimatedHoursPerUnit: 3.0,
    requiredMaterials: ['Ajrakh Printed Cotton', 'Foam Interfacing', 'Nylon Coil Zip', 'Organic Cotton Lining']
  },
  {
    id: 'prod-3',
    name: 'Jute-Cotton Heritage Tote Bag',
    hindiName: 'जूट-कॉटन हेरिटेज टोट बैग',
    category: 'Tote Bag',
    pieceRate: 240,
    description: 'Sturdy everyday tote bag handcrafted from eco-friendly jute and cotton canvas with internal zipper pocket.',
    hindiDescription: 'मजबूत पर्यावरण-अनुकूल जूट और कॉटन कैनवास टोट बैग, अंदर ज़िप वाली जेब सहित।',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80',
    estimatedHoursPerUnit: 2.5,
    requiredMaterials: ['Jute-Canvas Blend', 'Cotton Webbing Straps', 'Brass Metal Zip', 'Organic Cotton Lining']
  },
  {
    id: 'prod-4',
    name: 'Kalamkari Hand-Block Zipper Clutch',
    hindiName: 'कलमकारी हैंड-ब्लॉक ज़िपर क्लच',
    category: 'Clutch',
    pieceRate: 190,
    description: 'Compact travel clutch featuring Andhra Kalamkari hand-block botanical motifs and wristlet strap.',
    hindiDescription: 'आंध्र की पारंपरिक कलमकारी वनस्पति रूपांकनों वाला खूबसूरत ट्रैवल क्लच।',
    imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=400&q=80',
    estimatedHoursPerUnit: 2.0,
    requiredMaterials: ['Handloom Cotton Fabric', 'Brass Metal Zip', 'Wristlet Hardware', 'Organic Cotton Lining']
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'KRG-ORD-2026-101',
    productId: 'prod-1',
    productName: 'Kantha Embroidered Artisan Pouch',
    productHindiName: 'कांथा कशीदाकारी ज़िपर पाउच',
    productCategory: 'Pouch',
    artisanId: 'art-1',
    artisanName: 'Sunita Sharma',
    assignedQty: 30,
    completedQty: 24,
    deadline: '2026-10-28',
    priority: 'urgent',
    status: 'in_progress',
    paymentStatus: 'pending',
    pieceRate: 140,
    requiredMaterials: '3m Cream Handloom Cotton, 30 Brass Zips, Anchor Thread #402',
    hindiMaterials: '3 मीटर क्रीम सूती कपड़ा, 30 पीतल की ज़िप, एंकर धागा',
    instructions: 'Use double running stitch along the leaf motif. Press corners crisply before inserting the brass zip.',
    hindiInstructions: 'पत्ती के रूपांकन पर दोहरा धागा चलाएं। ज़िप लगाने से पहले कोनों को अच्छी तरह प्रेस करें।',
    proofUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
    proofNotes: '24 units stitched and checked for thread knots.',
    createdAt: '2026-10-18'
  },
  {
    id: 'ord-102',
    orderNumber: 'KRG-ORD-2026-102',
    productId: 'prod-2',
    productName: 'Ajrakh Block-Print Laptop Sleeve',
    productHindiName: 'अजरक ब्लॉक प्रिंट लैपटॉप स्लीव',
    productCategory: 'Laptop Sleeve',
    artisanId: 'art-1',
    artisanName: 'Sunita Sharma',
    assignedQty: 20,
    completedQty: 20,
    deadline: '2026-10-22',
    priority: 'high',
    status: 'completed',
    paymentStatus: 'approved',
    pieceRate: 290,
    requiredMaterials: '5m Ajrakh Indigo Cloth, 20 Heavy Nylon Zips, 20 Quilted Foam Pads',
    hindiMaterials: '5 मीटर अजरक कपड़ा, 20 नायलॉन ज़िप, 20 फोम पैड',
    instructions: '13-inch laptop fit. Maintain 1-inch diamond quilting pattern.',
    hindiInstructions: '13 इंच लैपटॉप का आकार। 1 इंच के डायमंड क्विल्टिंग पैटर्न का पालन करें।',
    proofUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    proofNotes: 'Batch completed, verified by Shakti Foundation supervisor.',
    createdAt: '2026-10-10',
    completedAt: '2026-10-21'
  },
  {
    id: 'ord-103',
    orderNumber: 'KRG-ORD-2026-103',
    productId: 'prod-3',
    productName: 'Jute-Cotton Heritage Tote Bag',
    productHindiName: 'जूट-कॉटन हेरिटेज टोट बैग',
    productCategory: 'Tote Bag',
    artisanId: 'art-2',
    artisanName: 'Fatima Ansari',
    assignedQty: 25,
    completedQty: 18,
    deadline: '2026-10-30',
    priority: 'high',
    status: 'in_progress',
    paymentStatus: 'pending',
    pieceRate: 240,
    requiredMaterials: '6m Jute-Canvas, 50m Cotton Webbing Straps, 25 Zips',
    hindiMaterials: '6 मीटर जूट-कैनवास, 50 मीटर पट्टे, 25 ज़िप',
    instructions: 'Reinforce handle box-X stitch with heavy thread for 10kg load bearing.',
    hindiInstructions: '10 किलो वजन उठाने के लिए हैंडल पर मजबूत बॉक्स-X सिलाई लगाएं।',
    createdAt: '2026-10-19'
  },
  {
    id: 'ord-104',
    orderNumber: 'KRG-ORD-2026-104',
    productId: 'prod-1',
    productName: 'Kantha Embroidered Artisan Pouch',
    productHindiName: 'कांथा कशीदाकारी ज़िपर पाउच',
    productCategory: 'Pouch',
    artisanId: 'art-2',
    artisanName: 'Fatima Ansari',
    assignedQty: 40,
    completedQty: 40,
    deadline: '2026-10-15',
    priority: 'normal',
    status: 'completed',
    paymentStatus: 'paid',
    pieceRate: 140,
    requiredMaterials: '4m Handloom Cotton, 40 Zips',
    hindiMaterials: '4 मीटर सूती कपड़ा, 40 ज़िप',
    instructions: 'Standard retail export packaging with artisan signed tag.',
    hindiInstructions: 'कारीगर के हस्ताक्षर वाले टैग के साथ मानक निर्यात पैकिंग।',
    createdAt: '2026-10-02',
    completedAt: '2026-10-14'
  },
  {
    id: 'ord-105',
    orderNumber: 'KRG-ORD-2026-105',
    productId: 'prod-4',
    productName: 'Kalamkari Hand-Block Zipper Clutch',
    productHindiName: 'कलमकारी हैंड-ब्लॉक ज़िपर क्लच',
    productCategory: 'Clutch',
    artisanId: 'art-3',
    artisanName: 'Meena Devi',
    assignedQty: 35,
    completedQty: 12,
    deadline: '2026-11-02',
    priority: 'medium',
    status: 'in_progress',
    paymentStatus: 'pending',
    pieceRate: 190,
    requiredMaterials: '4m Kalamkari Cloth, 35 Brass Zips, 35 Wristlet Rings',
    hindiMaterials: '4 मीटर कलमकारी कपड़ा, 35 पीतल की ज़िप, 35 छल्ले',
    instructions: 'Align floral border along the front flap.',
    hindiInstructions: 'सामने के फ्लैप पर फूलों की बॉर्डर को सीधा संरेखित करें।',
    createdAt: '2026-10-21'
  },
  {
    id: 'ord-106',
    orderNumber: 'KRG-ORD-2026-106',
    productId: 'prod-2',
    productName: 'Ajrakh Block-Print Laptop Sleeve',
    productHindiName: 'अजरक ब्लॉक प्रिंट लैपटॉप स्लीव',
    productCategory: 'Laptop Sleeve',
    artisanId: 'art-4',
    artisanName: 'Laxmi Kamble',
    assignedQty: 15,
    completedQty: 0,
    deadline: '2026-11-05',
    priority: 'normal',
    status: 'not_started',
    paymentStatus: 'pending',
    pieceRate: 290,
    requiredMaterials: '3.5m Ajrakh Indigo, 15 Zips, Foam Pads',
    hindiMaterials: '3.5 मीटर अजरक कपड़ा, 15 ज़िप, फोम पैड',
    instructions: 'Pick up raw materials from Shakti Chembur hub.',
    hindiInstructions: 'शक्ति फाउंडेशन चेम्बूर केंद्र से कच्ची सामग्री प्राप्त करें।',
    createdAt: '2026-10-23'
  }
];

export const initialHours: WorkingHourEntry[] = [
  {
    id: 'hr-1',
    artisanId: 'art-1',
    artisanName: 'Sunita Sharma',
    date: '2026-10-23',
    startTime: '10:00',
    endTime: '15:30',
    durationHours: 5.0,
    breakMinutes: 30,
    orderId: 'ord-101',
    orderNumber: 'KRG-ORD-2026-101',
    notes: 'Stitched 6 Kantha pouches and attached brass zips.',
    status: 'approved',
    reviewerNotes: 'Production inspected and approved by Shakti supervisor.',
    submittedAt: '2026-10-23T16:00:00Z'
  },
  {
    id: 'hr-2',
    artisanId: 'art-1',
    artisanName: 'Sunita Sharma',
    date: '2026-10-22',
    startTime: '10:30',
    endTime: '16:00',
    durationHours: 5.0,
    breakMinutes: 30,
    orderId: 'ord-101',
    orderNumber: 'KRG-ORD-2026-101',
    notes: 'Completed floral threadwork on 7 pouches.',
    status: 'approved',
    submittedAt: '2026-10-22T16:15:00Z'
  },
  {
    id: 'hr-3',
    artisanId: 'art-1',
    artisanName: 'Sunita Sharma',
    date: '2026-10-24',
    startTime: '09:30',
    endTime: '14:00',
    durationHours: 4.0,
    breakMinutes: 30,
    orderId: 'ord-101',
    orderNumber: 'KRG-ORD-2026-101',
    notes: 'Finishing the remaining 6 pouches today.',
    status: 'submitted',
    submittedAt: '2026-10-24T14:10:00Z'
  },
  {
    id: 'hr-4',
    artisanId: 'art-2',
    artisanName: 'Fatima Ansari',
    date: '2026-10-23',
    startTime: '11:00',
    endTime: '17:00',
    durationHours: 5.5,
    breakMinutes: 30,
    orderId: 'ord-103',
    orderNumber: 'KRG-ORD-2026-103',
    notes: 'Stitched heavy tote bag canvas and reinforced handles.',
    status: 'submitted',
    submittedAt: '2026-10-23T17:15:00Z'
  },
  {
    id: 'hr-5',
    artisanId: 'art-3',
    artisanName: 'Meena Devi',
    date: '2026-10-23',
    startTime: '13:00',
    endTime: '17:30',
    durationHours: 4.0,
    breakMinutes: 30,
    orderId: 'ord-105',
    orderNumber: 'KRG-ORD-2026-105',
    notes: 'Pattern cutting and zipper lining.',
    status: 'approved',
    submittedAt: '2026-10-23T17:45:00Z'
  }
];

export const initialEarnings: EarningRecord[] = [
  {
    id: 'earn-1',
    artisanId: 'art-1',
    artisanName: 'Sunita Sharma',
    orderId: 'ord-102',
    orderNumber: 'KRG-ORD-2026-102',
    type: 'piece_rate',
    amount: 5800, // 20 sleeves * ₹290
    status: 'approved',
    description: '20 Ajrakh Block-Print Laptop Sleeves (Piece Rate @ ₹290)',
    hindiDescription: '20 अजरक ब्लॉक-प्रिंट लैपटॉप स्लीव (प्रति नग ₹290 दर से)',
    date: '2026-10-22'
  },
  {
    id: 'earn-2',
    artisanId: 'art-1',
    artisanName: 'Sunita Sharma',
    orderId: 'ord-098',
    orderNumber: 'KRG-ORD-2026-098',
    type: 'piece_rate',
    amount: 4200, // 30 pouches * ₹140
    status: 'paid',
    description: '30 Kantha Embroidered Pouches (Piece Rate @ ₹140)',
    hindiDescription: '30 कांथा कशीदाकारी पाउच (प्रति नग ₹140 दर से)',
    date: '2026-10-08',
    paidDate: '2026-10-12',
    paymentRef: 'UPI/HDFC/983410294821'
  },
  {
    id: 'earn-3',
    artisanId: 'art-1',
    artisanName: 'Sunita Sharma',
    type: 'hourly',
    amount: 2450,
    status: 'paid',
    description: 'Skill Enhancement Training Workshop & Masterclass Stipend (14 hrs @ ₹175/hr)',
    hindiDescription: 'कौशल संवर्धन प्रशिक्षण कार्यशाला मानदेय (14 घंटे ₹175/घंटे की दर से)',
    date: '2026-10-05',
    paidDate: '2026-10-07',
    paymentRef: 'IMPS/SBI/0023491823'
  },
  {
    id: 'earn-4',
    artisanId: 'art-2',
    artisanName: 'Fatima Ansari',
    orderId: 'ord-104',
    orderNumber: 'KRG-ORD-2026-104',
    type: 'piece_rate',
    amount: 5600, // 40 pouches * ₹140
    status: 'paid',
    description: '40 Kantha Embroidered Pouches (Piece Rate @ ₹140)',
    hindiDescription: '40 कांथा कशीदाकारी पाउच (प्रति नग ₹140 दर से)',
    date: '2026-10-14',
    paidDate: '2026-10-16',
    paymentRef: 'UPI/ICICI/552190348123'
  }
];

export const initialMaterials: Material[] = [
  {
    id: 'mat-1',
    name: 'Handloom Cotton Fabric (Cream/Natural)',
    hindiName: 'हथकरघा सूती कपड़ा (क्रीम/प्राकृतिक)',
    unit: 'meters',
    inStock: 125,
    minThreshold: 30,
    category: 'Fabric'
  },
  {
    id: 'mat-2',
    name: 'Ajrakh Natural Dye Block Printed Cloth',
    hindiName: 'अजरक प्राकृतिक रंगाई ब्लॉक प्रिंट कपड़ा',
    unit: 'meters',
    inStock: 68,
    minThreshold: 25,
    category: 'Fabric'
  },
  {
    id: 'mat-3',
    name: 'Jute-Canvas Eco-Blend Canvas',
    hindiName: 'जूट-कैनवास इको-ब्लेंड कपड़ा',
    unit: 'meters',
    inStock: 94,
    minThreshold: 20,
    category: 'Fabric'
  },
  {
    id: 'mat-4',
    name: 'Brass Antique Metal Zips (8-inch)',
    hindiName: 'एंटीक पीतल की ज़िप (8-इंच)',
    unit: 'pieces',
    inStock: 340,
    minThreshold: 80,
    category: 'Notions & Hardware'
  },
  {
    id: 'mat-5',
    name: 'High-Density Foam Interfacing Sheet',
    hindiName: 'हाई-डेंसिटी फोम पैडिंग शीट',
    unit: 'sheets',
    inStock: 45,
    minThreshold: 20,
    category: 'Padding'
  },
  {
    id: 'mat-6',
    name: 'Anchor Organic Embroidery Thread Skeins',
    hindiName: 'एंकर जैविक कढ़ाई धागा',
    unit: 'skeins',
    inStock: 280,
    minThreshold: 60,
    category: 'Thread'
  }
];

export const initialMaterialRequests: MaterialRequest[] = [
  {
    id: 'req-1',
    artisanId: 'art-1',
    artisanName: 'Sunita Sharma',
    materialId: 'mat-4',
    materialName: 'Brass Antique Metal Zips (8-inch)',
    requestedQty: 25,
    unit: 'pieces',
    reason: 'Need 25 zips for the next batch of Kantha pouches starting Tuesday.',
    status: 'pending',
    requestDate: '2026-10-23'
  },
  {
    id: 'req-2',
    artisanId: 'art-2',
    artisanName: 'Fatima Ansari',
    materialId: 'mat-6',
    materialName: 'Anchor Organic Embroidery Thread Skeins',
    requestedQty: 12,
    unit: 'skeins',
    reason: 'Ran out of crimson and sage green embroidery skeins.',
    status: 'fulfilled',
    requestDate: '2026-10-18',
    updatedDate: '2026-10-19'
  },
  {
    id: 'req-3',
    artisanId: 'art-3',
    artisanName: 'Meena Devi',
    materialId: 'mat-1',
    materialName: 'Handloom Cotton Fabric (Cream/Natural)',
    requestedQty: 10,
    unit: 'meters',
    reason: 'For lining internal compartments of Kalamkari clutches.',
    status: 'approved',
    requestDate: '2026-10-22',
    updatedDate: '2026-10-23'
  }
];

export const initialSurveys: Survey[] = [
  {
    id: 'surv-impact-6m',
    title: '6-Month Socio-Economic Impact & Independence Survey',
    hindiTitle: '6-मासिक सामाजिक-आर्थिक प्रभाव एवं आत्मनिर्भरता सर्वेक्षण',
    description: 'Measuring tangible improvements in income, banking autonomy, decision making, and family well-being.',
    hindiDescription: 'आय, बैंक खाता संचालन, पारिवारिक निर्णयों और खुशहाली में आए सकारात्मक बदलावों का अध्ययन।',
    type: 'followup',
    createdAt: '2026-10-01',
    questions: [
      {
        id: 'q_income_confidence',
        text: 'How confident do you feel about meeting your household expenses now compared to before joining Karigari?',
        hindiText: 'कारीगरी से जुड़ने से पहले की तुलना में, अब आप घर के खर्च चलाने में कितनी आश्वस्त महसूस करती हैं?',
        type: 'stars',
        required: true,
        category: 'economic',
        helpText: '1 star = Not confident, 5 stars = Fully confident and secure',
        hindiHelpText: '1 स्टार = कम आश्वस्त, 5 स्टार = पूरी तरह आत्मनिर्भर'
      },
      {
        id: 'q_bank_control',
        text: 'Do you operate your own personal bank account / UPI for your craft earnings?',
        hindiText: 'क्या आप अपनी कमाई के लिए अपने निजी बैंक खाते या यूपीआई का स्वयं संचालन करती हैं?',
        type: 'yes_no',
        required: true,
        category: 'economic'
      },
      {
        id: 'q_children_education',
        text: 'Has your income contributed directly to children’s education, better nutrition, or healthcare?',
        hindiText: 'क्या आपकी कमाई का उपयोग बच्चों की शिक्षा, बेहतर खान-पान या स्वास्थ्य पर हुआ है?',
        type: 'yes_no',
        required: true,
        category: 'wellbeing'
      },
      {
        id: 'q_decision_power',
        text: 'How involved are you in major financial decisions in your household today?',
        hindiText: 'आज अपने परिवार के बड़े आर्थिक फैसलों में आपकी कितनी भागीदारी होती है?',
        type: 'single_choice',
        required: true,
        category: 'wellbeing',
        options: [
          { label: 'I make independent decisions', hindiLabel: 'मैं स्वतंत्र रूप से निर्णय लेती हूँ', value: 'independent' },
          { label: 'Joint decisions with family / spouse', hindiLabel: 'परिवार / पति के साथ मिलकर संयुक्त निर्णय', value: 'joint' },
          { label: 'Others make decisions for me', hindiLabel: 'अन्य लोग मेरे लिए निर्णय लेते हैं', value: 'dependent' }
        ]
      },
      {
        id: 'q_skill_satisfaction',
        text: 'Rate your satisfaction with the craft training, fair piece rates, and supervisor support.',
        hindiText: 'कारीगरी के प्रशिक्षण, उचित दरों और सुपरवाइजर के सहयोग पर अपनी संतुष्टि दर्ज करें।',
        type: 'stars',
        required: true,
        category: 'skills'
      }
    ]
  },
  {
    id: 'surv-monthly-checkin',
    title: 'Monthly Craft Comfort, Materials & Working Hours Check-In',
    hindiTitle: 'मासिक कार्य सुविधा, सामग्री व कार्य-घंटे समीक्षा',
    description: 'Ensuring safe, comfortable working conditions, fair workload, and prompt delivery of supplies.',
    hindiDescription: 'सुरक्षित कार्य वातावरण, उचित कार्यभार और समय पर कच्ची सामग्री सुनिश्चित करने हेतु।',
    type: 'monthly_checkin',
    createdAt: '2026-10-15',
    questions: [
      {
        id: 'q_work_hours_balance',
        text: 'Are your assigned orders manageable alongside household responsibilities?',
        hindiText: 'क्या आपको सौंपे गए ऑर्डर आपके घर की जिम्मेदारियों के साथ आसानी से पूरे हो पाते हैं?',
        type: 'yes_no',
        required: true,
        category: 'working_conditions'
      },
      {
        id: 'q_material_timeliness',
        text: 'How timely was the delivery of raw materials (cloth, zips, thread) this month?',
        hindiText: 'इस महीने कच्ची सामग्री (कपड़ा, ज़िप, धागा) आपको कितनी समय पर मिली?',
        type: 'stars',
        required: true,
        category: 'working_conditions'
      }
    ]
  }
];

export const initialSurveyResponses: SurveyResponse[] = [
  {
    id: 'resp-1',
    surveyId: 'surv-impact-6m',
    artisanId: 'art-1',
    artisanName: 'Sunita Sharma',
    answers: {
      q_income_confidence: 5,
      q_bank_control: 'yes',
      q_children_education: 'yes',
      q_decision_power: 'independent',
      q_skill_satisfaction: 5
    },
    submittedAt: '2026-10-12T11:30:00Z'
  },
  {
    id: 'resp-2',
    surveyId: 'surv-impact-6m',
    artisanId: 'art-2',
    artisanName: 'Fatima Ansari',
    answers: {
      q_income_confidence: 5,
      q_bank_control: 'yes',
      q_children_education: 'yes',
      q_decision_power: 'independent',
      q_skill_satisfaction: 5
    },
    submittedAt: '2026-10-14T14:15:00Z'
  },
  {
    id: 'resp-3',
    surveyId: 'surv-impact-6m',
    artisanId: 'art-3',
    artisanName: 'Meena Devi',
    answers: {
      q_income_confidence: 4,
      q_bank_control: 'yes',
      q_children_education: 'yes',
      q_decision_power: 'joint',
      q_skill_satisfaction: 4
    },
    submittedAt: '2026-10-15T16:00:00Z'
  },
  {
    id: 'resp-4',
    surveyId: 'surv-impact-6m',
    artisanId: 'art-4',
    artisanName: 'Laxmi Kamble',
    answers: {
      q_income_confidence: 4,
      q_bank_control: 'yes',
      q_children_education: 'yes',
      q_decision_power: 'joint',
      q_skill_satisfaction: 4
    },
    submittedAt: '2026-10-16T10:20:00Z'
  },
  {
    id: 'resp-5',
    surveyId: 'surv-impact-6m',
    artisanId: 'art-5',
    artisanName: 'Rekha Prajapati',
    answers: {
      q_income_confidence: 4,
      q_bank_control: 'yes',
      q_children_education: 'yes',
      q_decision_power: 'joint',
      q_skill_satisfaction: 5
    },
    submittedAt: '2026-10-18T12:00:00Z'
  },
  {
    id: 'resp-6',
    surveyId: 'surv-impact-6m',
    artisanId: 'art-6',
    artisanName: 'Shanti Gaikwad',
    answers: {
      q_income_confidence: 5,
      q_bank_control: 'yes',
      q_children_education: 'yes',
      q_decision_power: 'independent',
      q_skill_satisfaction: 5
    },
    submittedAt: '2026-10-19T09:45:00Z'
  },
  {
    id: 'resp-7',
    surveyId: 'surv-impact-6m',
    artisanId: 'art-7',
    artisanName: 'Anjum Bano',
    answers: {
      q_income_confidence: 4,
      q_bank_control: 'yes',
      q_children_education: 'yes',
      q_decision_power: 'joint',
      q_skill_satisfaction: 4
    },
    submittedAt: '2026-10-20T17:10:00Z'
  },
  {
    id: 'resp-8',
    surveyId: 'surv-impact-6m',
    artisanId: 'art-8',
    artisanName: 'Savitri Bai',
    answers: {
      q_income_confidence: 5,
      q_bank_control: 'yes',
      q_children_education: 'yes',
      q_decision_power: 'independent',
      q_skill_satisfaction: 5
    },
    submittedAt: '2026-10-21T13:30:00Z'
  }
];

export const demoUsers: User[] = [
  {
    id: 'usr-sunita',
    name: 'Sunita Sharma',
    hindiName: 'सुनीता शर्मा',
    phone: '9820145672',
    role: 'artisan',
    artisanId: 'art-1',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'usr-fatima',
    name: 'Fatima Ansari',
    hindiName: 'फातिमा अंसारी',
    phone: '9811234589',
    role: 'artisan',
    artisanId: 'art-2',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'usr-pooja',
    name: 'Pooja Rao',
    hindiName: 'पूजा राव',
    phone: '9820011223',
    role: 'admin',
    preferredLanguage: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  }
];
