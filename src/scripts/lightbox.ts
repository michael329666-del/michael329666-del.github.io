import type { GalleryPhoto } from '../data/portfolio';

export type LightboxPhoto = Pick<GalleryPhoto, 'src' | 'alt' | 'title'>;

export function createLightbox(
  dialog: HTMLDialogElement,
  photos: LightboxPhoto[],
  onClose?: (index: number) => void,
) {
  const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]');
  const count = dialog.querySelector<HTMLElement>('[data-lightbox-count]');
  const previous = dialog.querySelector<HTMLButtonElement>('[data-lightbox-prev]');
  const next = dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]');
  let current = 0;

  if (previous) previous.hidden = photos.length < 2;
  if (next) next.hidden = photos.length < 2;

  function show(index: number) {
    if (!photos.length || !image) return;
    current = ((index % photos.length) + photos.length) % photos.length;
    const photo = photos[current];
    image.src = photo.src;
    image.alt = photo.alt;
    if (caption) caption.textContent = photo.title || photo.alt;
    if (count) count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  }

  previous?.addEventListener('click', () => show(current - 1));
  next?.addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', (event) => {
    if (!dialog.open || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    image?.removeAttribute('src');
    onClose?.(current);
  });

  return {
    open(index: number) {
      if (!photos.length || !image) return;
      show(index);
      if (!dialog.open) dialog.showModal();
    },
  };
}
