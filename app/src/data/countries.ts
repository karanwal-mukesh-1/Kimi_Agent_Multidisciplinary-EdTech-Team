export interface CountryFact {
  id: string;
  text: string;
  icon: string;
}

export interface MiniGame {
  type: 'flag-match' | 'sort-food' | 'greeting-match';
  pairs?: { id: string; flag: string; name: string }[];
  foods?: { id: string; name: string; image: string; isLocal: boolean }[];
  greeting?: { audio: string; text: string; options: string[]; correct: string };
}

export interface Country {
  id: string;
  name: string;
  capital: string;
  continent: string;
  flag: string;
  color: string;
  position: { lat: number; lng: number };
  image: string;
  mascotAccessory: string;
  facts: CountryFact[];
  foods: string[];
  greeting: string;
  greetingLocal: string;
  landmark: string;
  animal: string;
  miniGame: MiniGame;
  gems: number;
}

export const countries: Country[] = [
  {
    id: 'france',
    name: 'France',
    capital: 'Paris',
    continent: 'Europe',
    flag: '🇫🇷',
    color: '#FFB7B2',
    position: { lat: 46.2276, lng: 2.2137 },
    image: '/assets/countries/france.jpg',
    mascotAccessory: 'beret',
    facts: [
      { id: 'f1', text: 'The Eiffel Tower is here! It was built in 1889.', icon: '🗼' },
      { id: 'f2', text: 'People in France love to eat croissants for breakfast!', icon: '🥐' },
      { id: 'f3', text: 'They say \"Bonjour\" which means Hello!', icon: '👋' },
    ],
    foods: ['croissant', 'baguette', 'cheese', 'snail'],
    greeting: 'Bonjour',
    greetingLocal: 'Hello',
    landmark: 'Eiffel Tower',
    animal: '🐓',
    miniGame: {
      type: 'flag-match',
      pairs: [
        { id: 'p1', flag: '🇫🇷', name: 'France' },
        { id: 'p2', flag: '🇫🇷', name: 'France' },
        { id: 'p3', flag: '🇪🇬', name: 'Egypt' },
        { id: 'p4', flag: '🇪🇬', name: 'Egypt' },
      ],
    },
    gems: 10,
  },
  {
    id: 'egypt',
    name: 'Egypt',
    capital: 'Cairo',
    continent: 'Africa',
    flag: '🇪🇬',
    color: '#FFDAC1',
    position: { lat: 26.8206, lng: 30.8025 },
    image: '/assets/countries/egypt.jpg',
    mascotAccessory: 'pharaoh',
    facts: [
      { id: 'e1', text: 'The Pyramids are HUGE! They are over 4,000 years old!', icon: '🔺' },
      { id: 'e2', text: 'The Sphinx has a lion\'s body and a person\'s face!', icon: '🦁' },
      { id: 'e3', text: 'They eat falafel - yummy crispy balls made from beans!', icon: '🧆' },
    ],
    foods: ['falafel', 'koshari', 'pita', 'dates'],
    greeting: 'Marhaba',
    greetingLocal: 'Hello',
    landmark: 'Pyramids of Giza',
    animal: '🐪',
    miniGame: {
      type: 'flag-match',
      pairs: [
        { id: 'p1', flag: '🇪🇬', name: 'Egypt' },
        { id: 'p2', flag: '🇪🇬', name: 'Egypt' },
        { id: 'p3', flag: '🇫🇷', name: 'France' },
        { id: 'p4', flag: '🇫🇷', name: 'France' },
        { id: 'p5', flag: '🇯🇵', name: 'Japan' },
        { id: 'p6', flag: '🇯🇵', name: 'Japan' },
      ],
    },
    gems: 15,
  },
  {
    id: 'japan',
    name: 'Japan',
    capital: 'Tokyo',
    continent: 'Asia',
    flag: '🇯🇵',
    color: '#FFB7C5',
    position: { lat: 36.2048, lng: 138.2529 },
    image: '/assets/countries/japan.jpg',
    mascotAccessory: 'kimono',
    facts: [
      { id: 'j1', text: 'Cherry blossoms are so beautiful! They bloom in spring.', icon: '🌸' },
      { id: 'j2', text: 'Sushi comes from Japan - rice and yummy fish rolls!', icon: '🍣' },
      { id: 'j3', text: 'They say \"Konnichiwa\" which means Hello!', icon: '👋' },
    ],
    foods: ['sushi', 'ramen', 'tempura', 'mochi'],
    greeting: 'Konnichiwa',
    greetingLocal: 'Hello',
    landmark: 'Mount Fuji',
    animal: '🐼',
    miniGame: {
      type: 'sort-food',
      foods: [
        { id: 'f1', name: 'Sushi', image: '🍣', isLocal: true },
        { id: 'f2', name: 'Pizza', image: '🍕', isLocal: false },
        { id: 'f3', name: 'Ramen', image: '🍜', isLocal: true },
        { id: 'f4', name: 'Croissant', image: '🥐', isLocal: false },
      ],
    },
    gems: 20,
  },
  {
    id: 'brazil',
    name: 'Brazil',
    capital: 'Brasília',
    continent: 'South America',
    flag: '🇧🇷',
    color: '#B5EAD7',
    position: { lat: -14.235, lng: -51.9253 },
    image: '/assets/countries/brazil.jpg',
    mascotAccessory: 'carnival',
    facts: [
      { id: 'b1', text: 'The Amazon Rainforest is the biggest forest in the world!', icon: '🌳' },
      { id: 'b2', text: 'People in Brazil LOVE football! They are super good at it!', icon: '⚽' },
      { id: 'b3', text: 'Carnival is a huge party with dancing, music, and colorful costumes!', icon: '🎉' },
    ],
    foods: ['feijoada', 'pão de queijo', 'brigadeiro', 'açaí'],
    greeting: 'Olá',
    greetingLocal: 'Hello',
    landmark: 'Christ the Redeemer',
    animal: '🦜',
    miniGame: {
      type: 'greeting-match',
      greeting: {
        audio: 'ola',
        text: 'Olá!',
        options: ['Hello!', 'Olá!', 'Hola!'],
        correct: 'Olá!',
      },
    },
    gems: 25,
  },
  {
    id: 'italy',
    name: 'Italy',
    capital: 'Rome',
    continent: 'Europe',
    flag: '🇮🇹',
    color: '#FFDAC1',
    position: { lat: 41.8719, lng: 12.5674 },
    image: '/assets/countries/italy.jpg',
    mascotAccessory: 'chef',
    facts: [
      { id: 'i1', text: 'The Leaning Tower of Pisa really leans! It looks like it might fall!', icon: '🏛️' },
      { id: 'i2', text: 'Pizza was invented in Naples, Italy! Yum!', icon: '🍕' },
      { id: 'i3', text: 'People ride gondola boats in Venice - it\'s like a city on water!', icon: '🛶' },
    ],
    foods: ['pizza', 'pasta', 'gelato', 'tiramisu'],
    greeting: 'Ciao',
    greetingLocal: 'Hello',
    landmark: 'Colosseum',
    animal: '🐕',
    miniGame: {
      type: 'flag-match',
      pairs: [
        { id: 'p1', flag: '🇮🇹', name: 'Italy' },
        { id: 'p2', flag: '🇮🇹', name: 'Italy' },
        { id: 'p3', flag: '🇫🇷', name: 'France' },
        { id: 'p4', flag: '🇫🇷', name: 'France' },
        { id: 'p5', flag: '🇪🇬', name: 'Egypt' },
        { id: 'p6', flag: '🇪🇬', name: 'Egypt' },
      ],
    },
    gems: 30,
  },
  {
    id: 'australia',
    name: 'Australia',
    capital: 'Canberra',
    continent: 'Oceania',
    flag: '🇦🇺',
    color: '#A2D2FF',
    position: { lat: -25.2744, lng: 133.7751 },
    image: '/assets/countries/australia.jpg',
    mascotAccessory: 'safari',
    facts: [
      { id: 'a1', text: 'Kangaroos live here! They hop around with babies in their pouch!', icon: '🦘' },
      { id: 'a2', text: 'The Great Barrier Reef is the biggest coral reef in the world!', icon: '🐠' },
      { id: 'a3', text: 'Koalas love to eat eucalyptus leaves and sleep all day!', icon: '🐨' },
    ],
    foods: ['vegemite', 'meat pie', 'lamington', 'pavlova'],
    greeting: 'G\'day',
    greetingLocal: 'Hello',
    landmark: 'Sydney Opera House',
    animal: '🦘',
    miniGame: {
      type: 'sort-food',
      foods: [
        { id: 'f1', name: 'Vegemite', image: '🍞', isLocal: true },
        { id: 'f2', name: 'Sushi', image: '🍣', isLocal: false },
        { id: 'f3', name: 'Meat Pie', image: '🥧', isLocal: true },
        { id: 'f4', name: 'Tacos', image: '🌮', isLocal: false },
        { id: 'f5', name: 'Lamington', image: '🍰', isLocal: true },
        { id: 'f6', name: 'Croissant', image: '🥐', isLocal: false },
      ],
    },
    gems: 35,
  },
  {
    id: 'usa',
    name: 'USA',
    capital: 'Washington D.C.',
    continent: 'North America',
    flag: '🇺🇸',
    color: '#C7CEEA',
    position: { lat: 37.0902, lng: -95.7129 },
    image: '/assets/countries/usa.jpg',
    mascotAccessory: 'cowboy',
    facts: [
      { id: 'u1', text: 'The Statue of Liberty was a gift from France! She holds a torch!', icon: '🗽' },
      { id: 'u2', text: 'The Grand Canyon is SO big you could fit buildings inside it!', icon: '🏔️' },
      { id: 'u3', text: 'Hollywood in California makes all the movies!', icon: '🎬' },
    ],
    foods: ['hamburger', 'hot dog', 'apple pie', 'mac and cheese'],
    greeting: 'Howdy',
    greetingLocal: 'Hello',
    landmark: 'Statue of Liberty',
    animal: '🦅',
    miniGame: {
      type: 'greeting-match',
      greeting: {
        audio: 'howdy',
        text: 'Howdy!',
        options: ['Hello!', 'Howdy!', 'Hi there!'],
        correct: 'Howdy!',
      },
    },
    gems: 40,
  },
  {
    id: 'india',
    name: 'India',
    capital: 'New Delhi',
    continent: 'Asia',
    flag: '🇮🇳',
    color: '#FFDAC1',
    position: { lat: 20.5937, lng: 78.9629 },
    image: '/assets/countries/india.jpg',
    mascotAccessory: 'turban',
    facts: [
      { id: 'd1', text: 'The Taj Mahal is a beautiful white palace made of love!', icon: '🕌' },
      { id: 'd2', text: 'People in India love colorful festivals with music and dancing!', icon: '🎊' },
      { id: 'd3', text: 'Tigers live in the forests of India! They are big and stripey!', icon: '🐅' },
    ],
    foods: ['curry', 'naan', 'samosa', 'biryani'],
    greeting: 'Namaste',
    greetingLocal: 'Hello',
    landmark: 'Taj Mahal',
    animal: '🐘',
    miniGame: {
      type: 'flag-match',
      pairs: [
        { id: 'p1', flag: '🇮🇳', name: 'India' },
        { id: 'p2', flag: '🇮🇳', name: 'India' },
        { id: 'p3', flag: '🇯🇵', name: 'Japan' },
        { id: 'p4', flag: '🇯🇵', name: 'Japan' },
        { id: 'p5', flag: '🇧🇷', name: 'Brazil' },
        { id: 'p6', flag: '🇧🇷', name: 'Brazil' },
        { id: 'p7', flag: '🇦🇺', name: 'Australia' },
        { id: 'p8', flag: '🇦🇺', name: 'Australia' },
        { id: 'p9', flag: '🇪🇬', name: 'Egypt' },
        { id: 'p10', flag: '🇪🇬', name: 'Egypt' },
      ],
    },
    gems: 45,
  },
  {
    id: 'mexico',
    name: 'Mexico',
    capital: 'Mexico City',
    continent: 'North America',
    flag: '🇲🇽',
    color: '#FFB7B2',
    position: { lat: 23.6345, lng: -102.5528 },
    image: '/assets/countries/mexico.jpg',
    mascotAccessory: 'sombrero',
    facts: [
      { id: 'm1', text: 'Chichen Itza is a super old pyramid built by ancient people!', icon: '🔺' },
      { id: 'm2', text: 'Tacos are from Mexico! You can put anything yummy inside!', icon: '🌮' },
      { id: 'm3', text: 'Day of the Dead is a colorful party to remember family!', icon: '💀' },
    ],
    foods: ['tacos', 'enchiladas', 'guacamole', 'churros'],
    greeting: 'Hola',
    greetingLocal: 'Hello',
    landmark: 'Chichen Itza',
    animal: '🦎',
    miniGame: {
      type: 'sort-food',
      foods: [
        { id: 'f1', name: 'Tacos', image: '🌮', isLocal: true },
        { id: 'f2', name: 'Sushi', image: '🍣', isLocal: false },
        { id: 'f3', name: 'Guacamole', image: '🥑', isLocal: true },
        { id: 'f4', name: 'Croissant', image: '🥐', isLocal: false },
        { id: 'f5', name: 'Enchiladas', image: '🌯', isLocal: true },
        { id: 'f6', name: 'Pizza', image: '🍕', isLocal: false },
      ],
    },
    gems: 50,
  },
  {
    id: 'kenya',
    name: 'Kenya',
    capital: 'Nairobi',
    continent: 'Africa',
    flag: '🇰🇪',
    color: '#B5EAD7',
    position: { lat: -0.0236, lng: 37.9062 },
    image: '/assets/countries/kenya.jpg',
    mascotAccessory: 'safari-vest',
    facts: [
      { id: 'k1', text: 'Lions and elephants roam free in Kenya\'s big parks!', icon: '🦁' },
      { id: 'k2', text: 'A safari is like a car adventure to see wild animals!', icon: '🚙' },
      { id: 'k3', text: 'Mount Kenya is a tall mountain covered in snow!', icon: '🏔️' },
    ],
    foods: ['ugali', 'nyama choma', 'sukuma wiki', 'mandazi'],
    greeting: 'Jambo',
    greetingLocal: 'Hello',
    landmark: 'Masai Mara',
    animal: '🦒',
    miniGame: {
      type: 'greeting-match',
      greeting: {
        audio: 'jambo',
        text: 'Jambo!',
        options: ['Hello!', 'Jambo!', 'Bonjour!'],
        correct: 'Jambo!',
      },
    },
    gems: 100,
  },
];

export const allFoods = [
  { name: 'Sushi', image: '🍣', countries: ['japan'] },
  { name: 'Ramen', image: '🍜', countries: ['japan'] },
  { name: 'Pizza', image: '🍕', countries: ['italy'] },
  { name: 'Pasta', image: '🍝', countries: ['italy'] },
  { name: 'Croissant', image: '🥐', countries: ['france'] },
  { name: 'Baguette', image: '🥖', countries: ['france'] },
  { name: 'Tacos', image: '🌮', countries: ['mexico'] },
  { name: 'Guacamole', image: '🥑', countries: ['mexico'] },
  { name: 'Falafel', image: '🧆', countries: ['egypt'] },
  { name: 'Curry', image: '🍛', countries: ['india'] },
  { name: 'Naan', image: '🫓', countries: ['india'] },
  { name: 'Hamburger', image: '🍔', countries: ['usa'] },
  { name: 'Hot Dog', image: '🌭', countries: ['usa'] },
  { name: 'Vegemite', image: '🍞', countries: ['australia'] },
  { name: 'Feijoada', image: '🍲', countries: ['brazil'] },
  { name: 'Açaí', image: '🫐', countries: ['brazil'] },
];

export const encouragements = [
  'Amazing! 🌟',
  'Great Explorer! 🗺️',
  'Fantastic! 🎉',
  'You did it! 🏆',
  'Super Star! ⭐',
  'Wonderful! ✨',
  'Keep going! 🚀',
  'So smart! 🧠',
  'Brilliant! 💡',
  'World Traveler! 🌍',
];
