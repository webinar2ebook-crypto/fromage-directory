export interface Cheese {
  id: string;
  slug: string;
  name: string;
  moniker: string;
  country: string;
  region: string;
  flag: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  milk: string;
  texture: string;
  aging: string;
  flavorNotes: string[];
  pairings: string[];
  servingTip: string;
  funFact: string;
}

export const HERO_IMAGE = '/src/assets/images/cheese_hero_spread_1793673378350.jpg';

export const CHEESES: Cheese[] = [
  {
    id: 'parmigiano-reggiano',
    slug: 'parmigiano-reggiano',
    name: 'Parmigiano-Reggiano',
    moniker: 'Il Re dei Formaggi (The King of Cheeses)',
    country: 'Italy',
    region: 'Emilia-Romagna (Parma, Reggio Emilia, Modena)',
    flag: '🇮🇹',
    image: '/src/assets/images/cheese_parmigiano_1793673376859.jpg',
    shortDescription:
      'Revered worldwide as the "King of Cheeses," Parmigiano-Reggiano is a Protected Designation of Origin (PDO) hard cow’s milk cheese aged for at least 12 to 36 months, celebrated for its crumbly crystalline texture and deep savory umami flavor.',
    fullDescription:
      'Crafted strictly in the provinces of Parma, Reggio Emilia, Modena, and designated parts of Mantua and Bologna, Parmigiano-Reggiano follows a meticulous production method that has remained virtually unchanged for over nine centuries. Raw milk from grass- and hay-fed cows is coagulated in traditional conical copper cauldrons, salted in brine for up to a month, and rested on untreated pinewood shelves where master inspectors hand-tap every single wheel with a silver hammer to verify its internal structural integrity before granting the iconic hot-iron branding.',
    milk: "Unpasteurized Cow's Milk",
    texture: 'Hard, granular, brittle with crunchy tyrosine crystals',
    aging: 'Aged 24 Months (Stagionato standard)',
    flavorNotes: ['Nutty Hazelnut', 'Savory Broth (Umami)', 'Subtle Dried Fruit', 'Sea Salt Finish'],
    pairings: [
      'Traditional Balsamic Vinegar of Modena',
      'Sparkling Lambrusco or Structured Chianti Classico',
      'Prosciutto di Parma & Crisp Bosc Pears',
      'Raw Wildflower Honey & Walnuts',
    ],
    servingTip:
      'Never cut Parmigiano with an ordinary knife blade. Use an almond-shaped parmigiano knife to gently split and wedge the wheel along its natural grain into rustic, bite-sized fragments.',
    funFact:
      'Italian banks historically accepted genuine wheels of aging Parmigiano-Reggiano as collateral for agricultural loans due to its steady appreciation and enduring value.',
  },
  {
    id: 'brie-de-meaux',
    slug: 'brie-de-meaux',
    name: 'Brie de Meaux',
    moniker: 'La Reine des Fromages (The Queen of Cheeses)',
    country: 'France',
    region: 'Île-de-France & Champagne-Ardenne (Meaux)',
    flag: '🇫🇷',
    image: '/src/assets/images/cheese_brie_1793673377378.jpg',
    shortDescription:
      'Known as the "Queen of Cheeses," Brie de Meaux is an iconic French soft-ripened cheese crowned with a delicate bloomy rind and an unctuous, golden-straw paste that yields an earthy aroma of mushrooms and warm clarified butter.',
    fullDescription:
      'Hailing from the historic town of Meaux just 50 kilometers east of Paris, Brie de Meaux was officially declared the "King of Cheeses and the Cheese of Kings" by diplomat Talleyrand during the legendary 1814 Congress of Vienna cheese tasting tournament. Still molded by hand using a perforated ladle known as a "pelle à brie" and turned manually during draining, it undergoes a gentle affinage on rye straw mats where the benign Penicillium camemberti mold forms its signature downy, snow-white rind.',
    milk: "Unpasteurized Cow's Milk (AOP)",
    texture: 'Supple, runny, unctuous with a soft velvety edible rind',
    aging: 'Aged 6 to 8 Weeks',
    flavorNotes: ['Cultured Sweet Butter', 'Wild Forest Mushrooms', 'Subtle Toasted Brioche', 'Earthy Hazelnut'],
    pairings: [
      'Crusty French Sourdough Baguette',
      'Dry Champagne or Crisp Chablis',
      'Fresh Black Mission Figs & Green Grapes',
      'Whole Grain Dijon Mustard & Cornichons',
    ],
    servingTip:
      'Always bring Brie de Meaux to room temperature for at least 45 to 60 minutes before serving. Cold temperature masks its rich bouquet of aromas and prevents the paste from reaching its luscious, molten texture.',
    funFact:
      'Emperor Charlemagne was recorded enjoying Brie at the Priory of Rueil en Brie in the year 774, marvelling that he had never tasted a more delicious culinary creation.',
  },
  {
    id: 'aged-gouda',
    slug: 'aged-gouda',
    name: 'Aged Gouda (Oude Kaas)',
    moniker: 'The Golden Treasure of Holland',
    country: 'Netherlands',
    region: 'South Holland (Zuid-Holland, Gouda & Krimpenerwaard)',
    flag: '🇳🇱',
    image: '/src/assets/images/cheese_gouda_1793673378523.jpg',
    shortDescription:
      'Originating from the historic Dutch cheese markets of South Holland, Aged Gouda is patient craftsmanship personified. Matured for up to 3 years, it develops a deep amber hue, rich butterscotch sweetness, and an addictive crystalline crunch.',
    fullDescription:
      'One of the oldest recorded cheeses in the world dating back to 1184, Gouda is named after the historic Dutch city where dairy farmers gathered to trade their wheels on the central market square with ceremonial hand-claps. The distinctive Dutch technique involves washing the curds with warm water to remove surplus lactose (milk sugars), which prevents excessive lactic acid formation. When matured for two to three years into "Oude" or "Overjarig" state, moisture evaporates, concentrating rich caramel notes and forming crunchy tyrosine crystals throughout.',
    milk: "Cow's Milk (Traditional Boerenkaas or Creamery)",
    texture: 'Firm, dense, micro-flaking with dense amino acid crunch',
    aging: 'Aged 18 to 36 Months',
    flavorNotes: ['Butterscotch & Burnt Caramel', 'Toasted Pecan', 'Saline Umami', 'Subtle Whiskey Tone'],
    pairings: [
      'Belgian Trappist Ale or Bourbon Whiskey',
      'Roasted Salted Almonds & Spiced Apple Chutney',
      'Dark Stone Fruits & Thin Seed Crackers',
      'Dark Stout or Malty Bock Beer',
    ],
    servingTip:
      'Shave paper-thin slices with a traditional Dutch cheese plane (kaasschaaf) to let the warmth of your tongue instantly melt the concentrated butterfat before the crystals crunch.',
    funFact:
      'Gouda accounts for over 50% of all cheese produced in the Netherlands, and centuries ago Dutch maritime vessels carried aged Gouda wheels as nutritious, long-lasting sea rations.',
  },
];
