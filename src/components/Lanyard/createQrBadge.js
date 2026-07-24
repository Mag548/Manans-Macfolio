/**
 * Builds the card back face with a QR code image.
 * Drop your QR at: public/images/lanyard-qr.png
 */
export const createQrBadge = ({
  qrUrl = '/images/lanyard-qr.png',
  title = 'Scan me',
  subtitle = 'Connect / portfolio',
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

    ctx.fillStyle = '#111827';
    ctx.font = '700 44px "SF Pro Display", "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 110);

    ctx.fillStyle = '#6b7280';
    ctx.font = '500 26px "SF Pro Text", "Segoe UI", system-ui, sans-serif';
    ctx.fillText(subtitle, width / 2, 155);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const qrSize = Math.min(width - 140, 440);
      const qrX = (width - qrSize) / 2;
      const qrY = 200;

      // White plate behind QR
      const pad = 28;
      const r = 24;
      const px = qrX - pad;
      const py = qrY - pad;
      const pw = qrSize + pad * 2;
      const ph = qrSize + pad * 2;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(px + r, py);
      ctx.arcTo(px + pw, py, px + pw, py + ph, r);
      ctx.arcTo(px + pw, py + ph, px, py + ph, r);
      ctx.arcTo(px, py + ph, px, py, r);
      ctx.arcTo(px, py, px + pw, py, r);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

      ctx.fillStyle = '#111827';
      ctx.font = '600 22px "SF Pro Text", "Segoe UI", system-ui, sans-serif';
      ctx.fillText('MANAN GOSWAMI', width / 2, height - 64);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      // Placeholder if QR file is missing
      ctx.fillStyle = '#ffffff';
      const qrSize = 360;
      const qrX = (width - qrSize) / 2;
      const qrY = 220;
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#d1d5db';
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
      ctx.fillStyle = '#6b7280';
      ctx.font = '500 22px "SF Pro Text", "Segoe UI", system-ui, sans-serif';
      ctx.fillText('Add QR image at', width / 2, qrY + qrSize / 2 - 12);
      ctx.fillText('public/images/lanyard-qr.png', width / 2, qrY + qrSize / 2 + 20);
      ctx.fillStyle = '#111827';
      ctx.font = '600 22px "SF Pro Text", "Segoe UI", system-ui, sans-serif';
      ctx.fillText('MANAN GOSWAMI', width / 2, height - 64);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = qrUrl;
  });
