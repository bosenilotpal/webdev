import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import HeroSection from '@/components/public/HeroSection';
import ClassCard from '@/components/public/ClassCard';
import PlanList from '@/components/public/PlanList';
import TrainerCard from '@/components/public/TrainerCard';
import NewsletterSection from '@/components/public/NewsletterSection';
import Carousel from '@/components/shared/Carousel';
import CardsGrid from '@/components/public/CardsGrid';
import {
  fetchGym,
  fetchClasses,
  fetchPlans,
  fetchTrainers,
  fetchCmsItems,
  getCmsByName,
} from '@/lib/api';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GymPage({ params }: PageProps) {
  const { id } = await params;

  let gym;
  let classes;
  let plans;
  let trainers;
  let cmsItems: Awaited<ReturnType<typeof fetchCmsItems>> = [];

  try {
    [gym, classes, plans, trainers, cmsItems] = await Promise.all([
      fetchGym(id),
      fetchClasses(id),
      fetchPlans(id),
      fetchTrainers(id),
      fetchCmsItems(id),
    ]);
  } catch {
    return (
      <div className="public-page">
        <Header />
        <main className="public-main">
          <div className="container">
            <h1>Unable to load gym</h1>
            <p>Make sure the Django API is running at http://127.0.0.1:8000</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const heroMain = getCmsByName(cmsItems, 'Hero Section Main');
  const heroSub = getCmsByName(cmsItems, 'Hero Section Sub');
  const heroDescription = getCmsByName(cmsItems, 'Hero Section Description');
  const featureBanner = getCmsByName(cmsItems, 'Feature Banner');
  const featureHeading = getCmsByName(cmsItems, 'Feature Heading');
  const featureDescription = getCmsByName(cmsItems, 'Feature Description');
  const classListHeading = getCmsByName(cmsItems, 'Class List Heading');
  const classListDescription = getCmsByName(cmsItems, 'Class List Description');
  const planListHeading = getCmsByName(cmsItems, 'Plan List Heading');
  const planListDescription = getCmsByName(cmsItems, 'Plan List Description');
  const trainerListHeading = getCmsByName(cmsItems, 'Trainer List Heading');
  const trainerListDescription = getCmsByName(
    cmsItems,
    'Trainer List Description'
  );

  if (!gym) {
    return (
      <div className="public-page">
        <Header />
        <main className="public-main">
          <div className="container">
            <h1>Gym not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="public-page">
      <Header />
      <HeroSection
        image={gym.image}
        subHeading={heroMain?.content}
        heading={heroSub?.content}
        description={heroDescription?.content}
      />
      <main className="public-main">
        <div className="container">
          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">
              {featureHeading?.content || gym.name}
            </h2>
            <p className="gym-detail-sub-heading">
              {featureDescription?.content || gym.description}
            </p>
            {featureBanner && (
              <div className="gym-detail-feature-banner">
                <p>{featureBanner.content}</p>
              </div>
            )}
          </section>

          <section id="classes-section" className="gym-detail-section">
            <h2 className="gym-detail-heading">
              {classListHeading?.content || 'Our Classes'}
            </h2>
            <p className="gym-detail-sub-heading">
              {classListDescription?.content ||
                'Choose from expert-led classes designed for every fitness level.'}
            </p>
            {classes.length > 0 ? (
              <CardsGrid>
                {classes.map((classItem) => (
                  <ClassCard key={classItem.id} classItem={classItem} />
                ))}
              </CardsGrid>
            ) : (
              <p>No classes listed for this gym yet.</p>
            )}
          </section>

          <section id="plans-section" className="gym-detail-section">
            <h2 className="gym-detail-heading">
              {planListHeading?.content || 'Membership Plans'}
            </h2>
            <p className="gym-detail-sub-heading">
              {planListDescription?.content ||
                'Find the membership plan that fits your lifestyle and budget.'}
            </p>
            {plans.length > 0 ? (
              <PlanList plans={plans} />
            ) : (
              <p>No plans listed for this gym yet.</p>
            )}
          </section>

          <section className="gym-detail-section">
            <h2 className="gym-detail-heading">
              {trainerListHeading?.content || 'Meet Our Trainers'}
            </h2>
            <p className="gym-detail-sub-heading">
              {trainerListDescription?.content ||
                'Our certified trainers are here to help you reach your goals.'}
            </p>
            {trainers.length > 0 ? (
              <Carousel itemsPerView={3}>
                {trainers.map((trainer) => (
                  <TrainerCard key={trainer.id} trainer={trainer} />
                ))}
              </Carousel>
            ) : (
              <p>No trainers listed for this gym yet.</p>
            )}
          </section>

          <NewsletterSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
