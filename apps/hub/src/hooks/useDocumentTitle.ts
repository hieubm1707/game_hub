import { useEffect } from 'react';

const SITE_ORIGIN = 'https://hieutien.life';
const DEFAULT_SOCIAL_TITLE = 'Game Hub — Free Offline-First Browser Games';
const DEFAULT_SOCIAL_DESCRIPTION =
  'Play curated offline-first puzzle, logic, and strategy games directly in your browser. Instant launch, local saves, and zero sign-up required.';
const DEFAULT_SOCIAL_IMAGE = `${SITE_ORIGIN}/og-image.png`;

export interface SocialMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

function upsertMetaTag(
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
) {
  let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attrName, attrValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function toPublicAbsoluteUrl(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (/^https:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return `${SITE_ORIGIN}${trimmed}`;
  return fallback;
}

export function useDocumentTitle(
  title: string,
  description?: string,
  social?: SocialMetadataOptions
) {
  const socialTitle = social?.title;
  const socialDescription = social?.description;
  const socialImage = social?.image;
  const socialPath = social?.path;

  useEffect(() => {
    document.title = `${title} — Game Hub`;
    if (description) {
      upsertMetaTag('name', 'description', description);
    }

    const resolvedTitle = socialTitle?.trim() || DEFAULT_SOCIAL_TITLE;
    const resolvedDescription = socialDescription?.trim() || DEFAULT_SOCIAL_DESCRIPTION;
    const resolvedImage = toPublicAbsoluteUrl(socialImage, DEFAULT_SOCIAL_IMAGE);
    const resolvedPath =
      socialPath ??
      (typeof window !== 'undefined' && window.location?.pathname ? window.location.pathname : '/');
    const resolvedUrl = toPublicAbsoluteUrl(resolvedPath, `${SITE_ORIGIN}/`);

    upsertMetaTag('property', 'og:title', resolvedTitle);
    upsertMetaTag('property', 'og:description', resolvedDescription);
    upsertMetaTag('property', 'og:url', resolvedUrl);
    upsertMetaTag('property', 'og:image', resolvedImage);
    upsertMetaTag('property', 'og:image:secure_url', resolvedImage);
    upsertMetaTag('property', 'og:image:alt', resolvedTitle);

    upsertMetaTag('name', 'twitter:title', resolvedTitle);
    upsertMetaTag('name', 'twitter:description', resolvedDescription);
    upsertMetaTag('name', 'twitter:url', resolvedUrl);
    upsertMetaTag('name', 'twitter:image', resolvedImage);
    upsertMetaTag('name', 'twitter:image:alt', resolvedTitle);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', resolvedUrl);
    }
  }, [title, description, socialTitle, socialDescription, socialImage, socialPath]);
}
