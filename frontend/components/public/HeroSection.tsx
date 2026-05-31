'use client';

import Button from '@/components/shared/Button';
import { getAssetPath } from '@/lib/utils';

interface HeroSectionProps {
  image?: string;
  subHeading?: string;
  heading?: string;
  description?: string;
}

export default function HeroSection({
  image,
  subHeading = 'STAY HEALTHY, STAY FIT',
  heading = 'GET IN SHAPE NOW',
  description = 'Train in the fitness gym and explore all benefits',
}: HeroSectionProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const heroStyle = image
    ? {
        backgroundImage: `url('${getAssetPath(image)}')`,
      }
    : undefined;

  return (
    <section className="hero-section" style={heroStyle}>
      <div className="hero-section-overlay" />
      <div className="hero-section-content">
        <div className="hero-section-text-box">
          <p className="hero-section-sub-heading">{subHeading}</p>
        </div>
        <h1 className="hero-section-heading">{heading}</h1>
        <p className="hero-section-description">{description}</p>
        <div className="hero-section-actions">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => scrollToSection('classes-section')}
          >
            See All Classes
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={() => scrollToSection('plans-section')}
          >
            View Plans
          </Button>
        </div>
      </div>
    </section>
  );
}
