/**
 * Builds a badge image with photo, name, subtitle, and QR.
 * QR file: public/images/lanyard-qr.png
 */
export const createProfileBadge = ({
  photoUrl,
  qrUrl = '/images/lanyard-qr.png',
  name = 'Manan Goswami',
  subtitle = 'CS & Business @WLU',
  width = 640,
  height = 960,
} = {}) =>
  new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas unsupported'));
      return;
    }

    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#f7f7f8');
    grad.addColorStop(1, '#e8eaee');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    const photo = new Image();
    photo.crossOrigin = 'anonymous';

    const finish = (qrImg) => {
      const edge = 40;
      const blockSize = Math.min(width - 140, 268); // photo + QR same size
      const nameSize = 46;
      const subSize = 34;
      const nameSubGap = 18;
      const textBlockH = nameSize + nameSubGap + subSize;

      // Equal gaps: top → photo → text → QR → bottom
      const used = blockSize + textBlockH + blockSize;
      const free = height - edge * 2 - used;
      const gap = free / 3;

      let y = edge;

      // Photo
      const photoX = (width - blockSize) / 2;
      const photoY = y;
      const r = 22;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(photoX + r, photoY);
      ctx.arcTo(photoX + blockSize, photoY, photoX + blockSize, photoY + blockSize, r);
      ctx.arcTo(photoX + blockSize, photoY + blockSize, photoX, photoY + blockSize, r);
      ctx.arcTo(photoX, photoY + blockSize, photoX, photoY, r);
      ctx.arcTo(photoX, photoY, photoX + blockSize, photoY, r);
      ctx.closePath();
      ctx.clip();

      const scale = Math.max(blockSize / photo.width, blockSize / photo.height);
      const dw = photo.width * scale;
      const dh = photo.height * scale;
      ctx.drawImage(
        photo,
        photoX + (blockSize - dw) / 2,
        photoY + (blockSize - dh) / 2,
        dw,
        dh
      );
      ctx.restore();

      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(photoX + r, photoY);
      ctx.arcTo(photoX + blockSize, photoY, photoX + blockSize, photoY + blockSize, r);
      ctx.arcTo(photoX + blockSize, photoY + blockSize, photoX, photoY + blockSize, r);
      ctx.arcTo(photoX, photoY + blockSize, photoX, photoY, r);
      ctx.arcTo(photoX, photoY, photoX + blockSize, photoY, r);
      ctx.closePath();
      ctx.stroke();

      y += blockSize + gap;

      // Name + subtitle (centered in text block)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#111827';
      ctx.font = `700 ${nameSize}px "SF Pro Display", "Segoe UI", system-ui, sans-serif`;
      ctx.fillText(name, width / 2, y + nameSize);

      ctx.fillStyle = '#4b5563';
      ctx.font = `600 ${subSize}px "SF Pro Text", "Segoe UI", system-ui, sans-serif`;
      ctx.fillText(subtitle, width / 2, y + nameSize + nameSubGap + subSize);

      y += textBlockH + gap;

      // QR — same size as photo
      const qrX = (width - blockSize) / 2;
      const qrY = y;
      const pad = 12;
      const pr = 16;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(qrX - pad + pr, qrY - pad);
      ctx.arcTo(
        qrX + blockSize + pad,
        qrY - pad,
        qrX + blockSize + pad,
        qrY + blockSize + pad,
        pr
      );
      ctx.arcTo(
        qrX + blockSize + pad,
        qrY + blockSize + pad,
        qrX - pad,
        qrY + blockSize + pad,
        pr
      );
      ctx.arcTo(qrX - pad, qrY + blockSize + pad, qrX - pad, qrY - pad, pr);
      ctx.arcTo(qrX - pad, qrY - pad, qrX + blockSize + pad, qrY - pad, pr);
      ctx.closePath();
      ctx.fill();

      if (qrImg) {
        ctx.drawImage(qrImg, qrX, qrY, blockSize, blockSize);
      } else {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '500 20px "SF Pro Text", "Segoe UI", system-ui, sans-serif';
        ctx.fillText('QR missing', width / 2, qrY + blockSize / 2);
      }

      resolve(canvas.toDataURL('image/png'));
    };

    photo.onload = () => {
      const qr = new Image();
      qr.crossOrigin = 'anonymous';
      qr.onload = () => finish(qr);
      qr.onerror = () => finish(null);
      qr.src = qrUrl;
    };
    photo.onerror = () => reject(new Error(`Failed to load photo: ${photoUrl}`));
    photo.src = photoUrl;
  });
