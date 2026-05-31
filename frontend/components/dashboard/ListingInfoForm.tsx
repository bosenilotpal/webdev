'use client';

import { useState, useEffect } from 'react';
import { Gym } from '@/lib/types';
import Input from '@/components/shared/Input';

interface ListingInfoFormProps {
  data: Partial<Gym>;
  onChange: (data: Partial<Gym>) => void;
}

export default function ListingInfoForm({ data, onChange }: ListingInfoFormProps) {
  const [formData, setFormData] = useState({
    name: data.name || '',
    location: data.location || '',
    image: data.image || '',
    description: data.description || '',
  });

  useEffect(() => {
    setFormData({
      name: data.name || '',
      location: data.location || '',
      image: data.image || '',
      description: data.description || '',
    });
  }, [data]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server
      // For now, we'll use a local URL
      const imageUrl = URL.createObjectURL(file);
      handleChange('image', imageUrl);
    }
  };

  return (
    <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
      <Input
        label="Gym Name *"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Enter your gym name"
        required
      />

      <Input
        label="Location *"
        value={formData.location}
        onChange={(e) => handleChange('location', e.target.value)}
        placeholder="e.g., Uralskaya, EKB"
        required
      />

      <div className="dashboard-form-image-upload-group">
        <label className="input-label">Gym Image *</label>
        <div className="dashboard-form-image-upload-container">
          {formData.image ? (
            <div className="dashboard-form-image-preview-container">
              <img src={formData.image} alt="Gym preview" className="dashboard-form-image-preview" />
              <button
                type="button"
                onClick={() => handleChange('image', '')}
                className="dashboard-form-remove-image-button"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="dashboard-form-image-placeholder">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="dashboard-form-file-input"
                id="gym-image-upload"
              />
              <label htmlFor="gym-image-upload" className="dashboard-form-file-input-label">
                <span>+</span>
                <span>Click to upload gym image</span>
                <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-xs)' }}>Recommended: 300x200px</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <Input
        label="Description (Optional)"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Brief description of your gym"
        multiline
      />
    </div>
  );
}




