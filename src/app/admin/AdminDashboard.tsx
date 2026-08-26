'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { addProduct, deleteProduct, createCategory, deleteCategory } from '@/app/actions/products';
import type { Product } from '@/components/CollectionClient';
import styles from './admin.module.css'; // Using the same CSS module

type AdminDashboardProps = {
  products: Product[];
  stats: {
    total: number;
    inStock: number;
    categories: number;
  };
  dbCategories?: string[];
};

const compressImage = (file: File, maxWidth = 1200): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = maxWidth / img.width;
        const width = img.width > maxWidth ? maxWidth : img.width;
        const height = img.width > maxWidth ? img.height * ratio : img.height;
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          },
          'image/jpeg',
          0.8 // 80% quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function AdminDashboard({ products, stats, dbCategories = [] }: AdminDashboardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'product' | 'category' | null;
    targetId: string | null;
    targetName: string | null;
    imageUrl: string | null;
  }>({
    isOpen: false,
    type: null,
    targetId: null,
    targetName: null,
    imageUrl: null,
  });
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [catError, setCatError] = useState<string | null>(null);
  const [catSuccess, setCatSuccess] = useState<string | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const catFormRef = useRef<HTMLFormElement>(null);

  const predefinedCategories = dbCategories.length > 0 ? dbCategories : [
    'Sneakers',
    'Signature Oxford',
    'Signature Monk Strap',
    'Signature Chelsea Boot',
    'Signature Balmoral Boot'
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Image compression
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      try {
        const compressed = await compressImage(imageFile);
        formData.set('image', compressed);
      } catch (err) {
        console.error('Image compression failed', err);
        // We'll just continue with original file if compression fails
      }
    }

    const result = await addProduct(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Shoe added successfully!');
      form.reset();
      setImagePreview(null);
      setTimeout(() => setSuccess(null), 3000);
    }

    setIsSubmitting(false);
  };

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCategorySubmitting(true);
    setCatError(null);
    setCatSuccess(null);

    const formData = new FormData(e.currentTarget);
    const result = await createCategory(formData);

    if (result.error) {
      setCatError(result.error);
    } else {
      setCatSuccess('Category added successfully!');
      catFormRef.current?.reset();
      setTimeout(() => setCatSuccess(null), 3000);
    }

    setIsCategorySubmitting(false);
  };

  const handleDeleteClick = (id: string, name: string, imageUrl: string | null) => {
    setDeleteModal({ isOpen: true, type: 'product', targetId: id, targetName: name, imageUrl });
  };

  const handleCategoryDeleteClick = (name: string) => {
    setDeleteModal({ isOpen: true, type: 'category', targetId: null, targetName: name, imageUrl: null });
  };

  const confirmDelete = async () => {
    if (!deleteModal.type) return;

    if (deleteModal.type === 'product' && deleteModal.targetId) {
      await deleteProduct(deleteModal.targetId, deleteModal.imageUrl);
    } else if (deleteModal.type === 'category' && deleteModal.targetName) {
      setIsCategorySubmitting(true);
      const result = await deleteCategory(deleteModal.targetName);
      if (result.error) {
        setCatError(result.error);
      } else {
        setCatSuccess(`Category "${deleteModal.targetName}" deleted successfully!`);
        setTimeout(() => setCatSuccess(null), 3000);
      }
      setIsCategorySubmitting(false);
    }
    
    setDeleteModal({ isOpen: false, type: null, targetId: null, targetName: null, imageUrl: null });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, type: null, targetId: null, targetName: null, imageUrl: null });
  };

  return (
    <div className={styles.adminContainer}>
      {deleteModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--white)',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'var(--font-sans)', fontSize: '1.25rem', color: 'var(--black)' }}>
              Confirm Deletion
            </h3>
            <p style={{ margin: '0 0 2rem 0', color: 'var(--warm-stone)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Are you sure you want to delete the {deleteModal.type === 'product' ? 'piece' : 'category'} <strong>"{deleteModal.targetName}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelDelete}
                style={{
                  background: 'transparent',
                  border: '1px solid #d8d5d0',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: 'var(--black)',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  background: '#C62828',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: '#FFF',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#B71C1C'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#C62828'}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.pageBackdrop} aria-hidden="true" />
      
      <header className={styles.adminHeader}>
        <div>
          <h1 className={styles.adminTitle}>Atelier Inventory</h1>
          <span className={styles.adminSubtitle}>Aeth An Graey — Manage exclusive collections</span>
        </div>
        <div className={styles.filterGroup}>
          <Link href="/admin" className={styles.filterBtn}>
            ← Back to Orders
          </Link>
          <button className={`${styles.filterBtn} ${styles.active}`}>
            Inventory Active
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Collection</span>
          <div className={styles.statValue}>{stats.total}</div>
          <p className={styles.statMeta}>Total shoes in database</p>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>In Stock</span>
          <div className={styles.statValue}>{stats.inStock}</div>
          <p className={styles.statMeta}>Available for enquiry</p>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Categories</span>
          <div className={styles.statValue}>{stats.categories}</div>
          <p className={styles.statMeta}>Unique styles / models</p>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>System Status</span>
          <div className={styles.statValue}>Live</div>
          <p className={styles.statMeta}>Accepting changes</p>
        </div>
      </section>

      {/* Main Grid: Form Left, Collection Right */}
      <section className={styles.twoColumnGrid}>
        
        {/* Left Column: Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Add Category Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Add Category</h2>
                <p className={styles.sectionSubtitle}>Create a new collection category.</p>
              </div>
            </div>
            
            {catError && <div style={{ padding: '0.8rem', backgroundColor: '#FFEBEE', color: '#C62828', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>{catError}</div>}
            {catSuccess && <div style={{ padding: '0.8rem', backgroundColor: '#E8F5E9', color: '#2E7D32', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>{catSuccess}</div>}

            <form ref={catFormRef} onSubmit={handleCategorySubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="New category name" 
                style={{ flex: 1, padding: '0.75rem', border: '1px solid #d8d5d0', borderRadius: '4px', background: 'rgba(255,255,255,0.7)', outline: 'none' }} 
              />
              <button 
                type="submit" 
                disabled={isCategorySubmitting}
                style={{
                  background: 'var(--black)',
                  color: 'var(--white)',
                  padding: '0.75rem 1.2rem',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: isCategorySubmitting ? 'wait' : 'pointer',
                  opacity: isCategorySubmitting ? 0.7 : 1
                }}
              >
                {isCategorySubmitting ? 'Adding...' : 'Add'}
              </button>
            </form>

            {/* Existing Categories List */}
            {dbCategories.length > 0 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 className={styles.statLabel} style={{ marginBottom: '0.5rem' }}>Existing Categories</h3>
                {dbCategories.map(cat => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.7)', border: '1px solid #d8d5d0', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--black)' }}>{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleCategoryDeleteClick(cat)}
                      disabled={isCategorySubmitting}
                      style={{ background: 'none', border: 'none', color: '#C62828', fontSize: '0.75rem', cursor: isCategorySubmitting ? 'wait' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: isCategorySubmitting ? 0.5 : 1 }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Shoe Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Register Piece</h2>
                <p className={styles.sectionSubtitle}>Add a new shoe to the database.</p>
              </div>
            </div>
            
            {error && <div style={{ padding: '0.8rem', backgroundColor: '#FFEBEE', color: '#C62828', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
            {success && <div style={{ padding: '0.8rem', backgroundColor: '#E8F5E9', color: '#2E7D32', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>{success}</div>}

            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className={styles.statLabel} style={{ marginBottom: '0.3rem' }}>Shoe Name *</label>
                <input type="text" name="name" required placeholder="e.g. Midnight Azure Sneaker" style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={styles.statLabel} style={{ marginBottom: '0.3rem' }}>Price (€) *</label>
                  <input type="number" name="price" required min="0" step="0.01" style={inputStyle} />
                </div>
                <div>
                  <label className={styles.statLabel} style={{ marginBottom: '0.3rem' }}>Category</label>
                  <select name="category" style={inputStyle}>
                    {predefinedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={styles.statLabel} style={{ marginBottom: '0.3rem' }}>Stock Status</label>
                  <select name="stock_status" style={inputStyle} defaultValue="In Stock">
                    <option value="In Stock">In Stock</option>
                    <option value="Pre-Order">Pre-Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Limited Edition">Limited Edition</option>
                  </select>
                </div>
                <div>
                  <label className={styles.statLabel} style={{ marginBottom: '0.3rem' }}>Count</label>
                  <input type="number" name="count" min="0" placeholder="e.g. 12" style={inputStyle} />
                </div>
              </div>

              <div>
                <label className={styles.statLabel} style={{ marginBottom: '0.3rem' }}>Description</label>
                <textarea name="description" rows={3} placeholder="Describe the materials, build..." style={{ ...inputStyle, resize: 'none' }}></textarea>
              </div>

              <div>
                <label className={styles.statLabel} style={{ marginBottom: '0.3rem' }}>Shoe Photo (Auto-compressed)</label>
                <div 
                  style={{ border: '1px dashed #d8d5d0', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.4)' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ color: 'var(--warm-stone)', fontSize: '0.8rem' }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--black)' }}>⇧</div>
                      <div>Click to upload photo</div>
                      <div style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>JPG, PNG will be resized automatically</div>
                    </div>
                  )}
                  <input type="file" name="image" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{
                  background: 'var(--black)',
                  color: 'var(--white)',
                  padding: '1rem',
                  borderRadius: '4px',
                  border: 'none',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  marginTop: '0.5rem',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Registering...' : 'Register Piece'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Store Collection */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Store Collection</h2>
              <p className={styles.sectionSubtitle}>Currently active catalog items.</p>
            </div>
            <span className={styles.sectionPill}>{products.length} pieces</span>
          </div>

          <div className={styles.customerList}>
            {products.length === 0 ? (
              <div className={styles.emptyState}>No pieces in database.</div>
            ) : (
              products.map((product) => (
                <article key={product.id} className={styles.customerRow} style={{ alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '60px', height: '60px', position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#F0EFEB' }}>
                      {product.image_url && <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} />}
                    </div>
                    <div>
                      <div className={styles.customerName}>{product.name}</div>
                      <div className={styles.customerEmail}>{product.category}</div>
                    </div>
                  </div>
                  <div className={styles.customerMeta}>
                    <span style={{ fontWeight: 600, color: 'var(--black)', fontSize: '0.9rem' }}>€{product.price}</span>
                    <span className={`${styles.badge} ${product.stock_status === 'In Stock' ? styles.badgePaid : styles.badgePending}`} style={{ marginTop: '0.3rem' }}>
                      {product.stock_status}
                    </span>
                    <button 
                      onClick={() => handleDeleteClick(product.id, product.name, product.image_url)}
                      style={{ background: 'none', border: 'none', color: '#C62828', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

      </section>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #d8d5d0',
  borderRadius: '4px',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.9rem',
  color: 'var(--black)',
  outline: 'none',
  background: 'rgba(255,255,255,0.7)',
  transition: 'border-color 0.3s ease'
};
