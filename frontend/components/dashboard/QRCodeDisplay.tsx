'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { fetchGym } from '@/lib/api';
import { Gym } from '@/lib/types';
import Button from '@/components/shared/Button';
import { FaWhatsapp, FaTelegram, FaDownload } from 'react-icons/fa';
import { getFullUrl } from '@/lib/utils';
import LoadingState from '@/components/shared/LoadingState';
import { useAuth } from '@/hooks/useAuth';

export default function QRCodeDisplay() {
  const { user, isLoading: authLoading } = useAuth();
  const [gym, setGym] = useState<Gym | null>(null);
  const [gymPageUrl, setGymPageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const gymId = user?.gymId;
    if (!gymId) {
      setGym(null);
      setGymPageUrl('');
      setLoading(false);
      return;
    }

    const pageUrl = getFullUrl(`/gym/${gymId}`);
    setGymPageUrl(pageUrl);
    setLoading(true);
    setError(null);

    fetchGym(gymId)
      .then((data) => {
        if (data) {
          setGym(data);
        } else {
          setGym(null);
          setError('Your gym could not be found.');
        }
      })
      .catch((err) => {
        setGym(null);
        setError(err instanceof Error ? err.message : 'Failed to load gym');
      })
      .finally(() => setLoading(false));
  }, [user?.gymId, authLoading]);

  const handleDownloadQR = () => {
    const qrContainer = document.querySelector('.qr-code-container');
    const svg = qrContainer?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'gym-qr-code.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const handleShareWhatsApp = () => {
    if (!gym || !gymPageUrl) return;
    const message = encodeURIComponent(
      `Check out ${gym.name}!\n\nScan the QR code or visit: ${gymPageUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleShareTelegram = () => {
    if (!gym || !gymPageUrl) return;
    const message = encodeURIComponent(
      `Check out ${gym.name}!\n\nScan the QR code or visit: ${gymPageUrl}`
    );
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(gymPageUrl)}&text=${message}`,
      '_blank'
    );
  };

  if (authLoading || loading) {
    return <LoadingState message="Loading your gym link..." />;
  }

  if (!user?.gymId) {
    return (
      <p>
        No gym is linked to your account. Complete registration or assign your user as gym
        owner in Django admin to get your share link.
      </p>
    );
  }

  if (error || !gym || !gymPageUrl) {
    return <p>{error ?? 'Unable to load your gym link.'}</p>;
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--spacing-2xl)',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          flex: '1',
          maxWidth: '600px',
          minWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-lg)',
          background: 'var(--color-white)',
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            marginBottom: 'var(--spacing-sm)',
          }}
        >
          Share QR Code — {gym.name}
        </h3>
        <div className="qr-code-container">
          <QRCodeSVG value={gymPageUrl} size={200} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              width: '100%',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={handleShareWhatsApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: '#25D366',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              <FaWhatsapp />
              <span>Share on WhatsApp</span>
            </button>
            <button
              onClick={handleShareTelegram}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: '#0088cc',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              <FaTelegram />
              <span>Share on Telegram</span>
            </button>
          </div>
          <Button variant="outline" onClick={handleDownloadQR} size="sm">
            <FaDownload style={{ marginRight: '6px' }} />
            Download QR Code
          </Button>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
            }}
          >
            Scan QR or go to the link below
            <br />
            <a
              href={gymPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
            >
              {gymPageUrl}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
