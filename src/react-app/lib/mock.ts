import { Product, JournalPost } from './api';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Royal Blue Sapphire', description: 'Exceptional royal blue sapphire from the gem fields of Ratnapura, Sri Lanka. This unheated beauty displays a vibrant, deep blue color that is highly sought after by collectors worldwide. Precision-cut to maximize brilliance.', price: 4200, category: 'Sapphire',
    image_url: '/src/react-app/assets/gems/blue-sapphire.jpg', images: ['/src/react-app/assets/gems/blue-sapphire.jpg'], stock: 1, weight: 1.5, shape: 'Oval', color: 'Royal Blue', treatment: 'Unheated', created_at: new Date().toISOString(), height: 7.2, width: 5.5, depth: 3.8
  },
  {
    id: '2', name: 'Padparadscha Sapphire', description: 'A rare and enchanting Padparadscha sapphire, named after the lotus flower. This unheated stone features a delicate balance of pink and orange hues, making it one of the rarest sapphire varieties in existence.', price: 8500, category: 'Sapphire',
    image_url: '/src/react-app/assets/gems/padparadscha.jpg', images: ['/src/react-app/assets/gems/padparadscha.jpg'], stock: 1, weight: 2.1, shape: 'Cushion', color: 'Peach-Orange', treatment: 'Unheated', created_at: new Date().toISOString(), height: 8.1, width: 6.4, depth: 4.2
  },
  {
    id: '3', name: 'Teal Sapphire', description: 'Modern and sophisticated, this teal sapphire combines deep blue and forest green tones. Heated to enhance its natural beauty, this precision-cut round stone is perfect for a unique engagement ring or a statement pendant.', price: 3100, category: 'Sapphire',
    image_url: '/src/react-app/assets/gems/teal-sapphire.jpg', images: ['/src/react-app/assets/gems/teal-sapphire.jpg'], stock: 1, weight: 1.8, shape: 'Round', color: 'Teal', treatment: 'Heated', created_at: new Date().toISOString(), height: 6.5, width: 6.5, depth: 4.0
  },
  {
    id: '4', name: 'Star Ruby', description: 'A natural Sri Lankan star ruby displaying a sharp six-rayed star when viewed under direct light. This unheated cabochon is a testament to the wonders of nature, combining rich red color with a rare optical phenomenon.', price: 5800, category: 'Ruby',
    image_url: '/src/react-app/assets/gems/star-ruby.jpg', images: ['/src/react-app/assets/gems/star-ruby.jpg'], stock: 1, weight: 3.5, shape: 'Cabochon', color: 'Red', treatment: 'Unheated', created_at: new Date().toISOString(), height: 9.0, width: 7.5, depth: 5.2
  }
];

export const MOCK_JOURNAL: JournalPost[] = [
  {
    id: '1',
    title: 'The Secret of the Blue Sapphire',
    author: 'Gemologist Expert',
    hero_image_url: '/src/react-app/assets/our_story_bg.jpg',
    introduction: 'Discover the ancient history and lore behind the most coveted gemstone in the world: the Ceylon Blue Sapphire.',
    sections: [
      {
        title: 'A Royal Heritage',
        content: 'For centuries, Sri Lanka has been known as the "Island of Gems." The blue sapphire from this region is renowned for its unique cornflower blue and royal blue hues. Historically, these stones have adorned the crowns of royalty across the globe, symbolizing wisdom, virtue, and good fortune.',
        imageUrl: '/src/react-app/assets/gems/blue-sapphire.jpg'
      },
      {
        title: 'The Sourcing Journey',
        content: 'Finding a top-quality royal blue sapphire requires patience and expert eyes. Our team travels to the riverbeds of Ratnapura, where these ancient treasures are found. Each stone is evaluated for its natural color, clarity, and potential to be transformed into a masterpiece.',
        imageUrl: '/src/react-app/assets/hero_bg_srilankan_v2.png'
      }
    ],
    conclusion: 'Owning a Ceylon Blue Sapphire is not just about the jewelry; it is about carrying a piece of Earth\'s history and the spirit of an island rich in tradition.',
    cta_text: 'Explore Sapphire Collection',
    cta_link: '/shop',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Ethical Brilliance in Ratnapura',
    author: 'Mining Lead',
    hero_image_url: '/src/react-app/assets/hero_bg_srilankan_v2.png',
    introduction: 'Our commitment to the environment and the community starts at the very beginning of the gemstone\'s journey.',
    sections: [
      {
        title: 'Community First',
        content: 'We believe that the brilliance of a gemstone should not be shadowed by unethical practices. In Ratnapura, we work directly with artisanal miners, ensuring they receive fair compensation and that their working conditions meet international safety standards.',
        imageUrl: '/src/react-app/assets/our_story_bg.jpg'
      }
    ],
    conclusion: 'When you choose Premium Gems Lanka, you support a sustainable ecosystem that protects both the land and its people.',
    cta_text: 'Learn Our Values',
    cta_link: '/our-story',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Mastering the Cut',
    author: 'Chief Lapidary',
    hero_image_url: '/src/react-app/assets/gems/blue-sapphire.jpg',
    introduction: 'Understanding how precision cutting transforms raw minerals into radiant masterpieces that capture the light.',
    sections: [
      {
        title: 'The Art of Precision',
        content: 'A raw gemstone is like a rough draft. Our master lapidaries use techniques passed down through generations to calculate the exact angles needed to achieve maximum brilliance. Every facet is polished to perfection, ensuring that the stone interacts with light in the most beautiful way possible.',
        imageUrl: '/src/react-app/assets/gems/padparadscha.jpg'
      }
    ],
    conclusion: 'The cut is the soul of the gemstone. It is what brings the natural color to life and gives the stone its unique personality.',
    cta_text: 'View Masterpieces',
    cta_link: '/shop',
    created_at: new Date().toISOString()
  }
];
