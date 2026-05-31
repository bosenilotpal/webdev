'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import GymCard from '@/components/public/GymCard';
import Button from '@/components/shared/Button';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';
import { fetchGyms } from '@/lib/api';
import { Gym } from '@/lib/types';

export default function PublicGymListingPage() {
  const [displayCount, setDisplayCount] = useState(12);
  const [userLocation, setUserLocation] = useState<string>('Your Location');
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGyms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGyms();
      setGyms(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load gyms';
      setError(
        message === 'Failed to fetch'
          ? 'Cannot reach the API. Start Django with: py -3 manage.py runserver (in the backend folder).'
          : message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGyms();
  }, [loadGyms]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const data = await response.json();
            if (data.city && data.principalSubdivision) {
              setUserLocation(`${data.city}, ${data.principalSubdivision}`);
            } else if (data.locality) {
              setUserLocation(data.locality);
            }
          } catch {
            setUserLocation('Your Area');
          }
        },
        () => {
          fetch('https://ipapi.co/json/')
            .then((res) => res.json())
            .then((data) => {
              if (data.city && data.region) {
                setUserLocation(`${data.city}, ${data.region}`);
              } else {
                setUserLocation('Your Area');
              }
            })
            .catch(() => setUserLocation('Your Area'));
        }
      );
    } else {
      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          if (data.city && data.region) {
            setUserLocation(`${data.city}, ${data.region}`);
          } else {
            setUserLocation('Your Area');
          }
        })
        .catch(() => setUserLocation('Your Area'));
    }
  }, []);

  const featuredGyms = gyms.filter((gym) => gym.featured);
  const locationQuery = userLocation.toLowerCase();
  const popularGymsAtLocation = gyms.filter((gym) => {
    const gymLocation = gym.location.toLowerCase();
    return (
      locationQuery !== 'your location' &&
      locationQuery !== 'your area' &&
      (gymLocation.includes(locationQuery.split(',')[0]?.trim() ?? '') ||
        locationQuery.includes(gymLocation.split(',')[0]?.trim() ?? ''))
    );
  });
  const popularGyms =
    popularGymsAtLocation.length > 0 ? popularGymsAtLocation : gyms.slice(0, 4);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 8);
  };

  if (loading) {
    return (
      <div className="public-page">
        <Header />
        <main className="public-main">
          <LoadingState message="Loading gyms..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-page">
        <Header />
        <main className="public-main">
          <ErrorState message={error} onRetry={loadGyms} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="public-page">
      <Header />
      <main className="public-main">
        <div className="container">
          {featuredGyms.length > 0 && (
            <section className="public-section">
              <h2 className="section-heading">Newly Featured</h2>
              <div className="gym-grid">
                {featuredGyms.slice(0, 4).map((gym) => (
                  <GymCard key={gym.id} gym={gym} />
                ))}
              </div>
            </section>
          )}

          {popularGyms.length > 0 && (
            <section className="public-section">
              <h2 className="section-heading">Popular Gym&apos;s at {userLocation}</h2>
              <div className="gym-grid">
                {popularGyms.slice(0, 4).map((gym) => (
                  <GymCard key={gym.id} gym={gym} />
                ))}
              </div>
            </section>
          )}

          <section className="public-section">
            <h2 className="section-heading">All</h2>
            {gyms.length === 0 ? (
              <p>No gyms available yet. Add gyms in the Django admin.</p>
            ) : (
              <>
                <div className="gym-grid">
                  {gyms.slice(0, displayCount).map((gym) => (
                    <GymCard key={gym.id} gym={gym} />
                  ))}
                </div>
                {displayCount < gyms.length && (
                  <div className="load-more-container">
                    <Button variant="primary" size="lg" onClick={handleLoadMore}>
                      Load More
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
