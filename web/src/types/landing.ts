export interface IFeaturesSection {
  sectionTitle: string;
  subtitle?: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface IProblemsSection {
  sectionTitle: string;
  subtitle?: string;
  problems: Array<{
    number: string;
    title: string;
    description: string;
  }>;
}

export interface IAboutSection {
  sectionTitle: string;
  name: string;
  bio: string;
  photo?: string;
  gallery?: string[]; // Галерея дополнительных фото
  achievements: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface IStepsSection {
  sectionTitle: string;
  subtitle?: string;
  steps: Array<{
    image?: string;
    title: string;
    description: string;
  }>;
}

export interface IProcessSection {
  sectionTitle: string;
  subtitle?: string;
  steps: Array<{
    number: number;
    title: string;
    description: string;
    duration?: string;
  }>;
}

export interface IStatsSection {
  sectionTitle: string;
  stats: Array<{
    value: string;
    label: string;
    description: string;
  }>;
}

export interface Landing {
  _id: string;
  slug: string;
  title: string;
  metaDescription: string;
  ogImage?: string;
  heroSection: {
    title: string;
    subtitle: string;
    ctaButton: {
      text: string;
      link: string;
    };
  };
  featuresSection?: IFeaturesSection;
  problemsSection?: IProblemsSection;
  aboutSection?: IAboutSection;
  stepsSection?: IStepsSection;
  processSection?: IProcessSection;
  statsSection?: IStatsSection;
  marathonsSection?: {
    sectionTitle: string;
    basic?: {
      marathonId: string;
      title: string;
      startDate: string;
      price: number;
      oldPrice?: number;
      duration: string;
      features: string[];
      ctaButton: {
        text: string;
        link: string;
      };
    };
    advanced?: {
      marathonId: string;
      title: string;
      startDate: string;
      price: number;
      oldPrice?: number;
      duration: string;
      features: string[];
      ctaButton: {
        text: string;
        link: string;
      };
    };
  };
  benefitsSection?: {
    benefits: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  testimonialsSection?: {
    testimonials: Array<{
      name: string;
      photo?: string;
      text: string;
      rating: number;
    }>;
  };
  resultsGallerySection?: {
    sectionTitle: string;
    description?: string;
    images: Array<{
      url: string;
      caption?: string;
      order: number;
    }>;
  };
  testimonialsGallerySection?: {
    sectionTitle: string;
    description?: string;
    images: Array<{
      url: string;
      caption?: string;
      order: number;
    }>;
  };
  ctaSection?: {
    title: string;
    subtitle: string;
    ctaButton: {
      text: string;
      link: string;
    };
  };
  
  // Интерактивные элементы
  detailModals?: Array<{
    title: string;
    content: string;
    linkText?: string;
    linkUrl?: string;
  }>;
  enrollButtons?: Array<{
    text: string;
    targetId: string;
  }>;
  paymentButtons?: Array<{
    text: string;
    targetId: string;
  }>;
  videoBlocks?: Array<{
    title?: string;
    videoUrl: string;
    poster?: string;
    order: number;
  }>;
  
  views: number;
  conversions: number;
}
