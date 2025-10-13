import React, { useEffect, useRef } from 'react';

function ImageLazy() {
  const imageRefs = useRef([]);

  useEffect(() => {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    imageRefs.current.forEach(img => {
      if (img) imageObserver.observe(img);
    });

    return () => imageObserver.disconnect();
  }, []);

  const images = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    src: `https://picsum.photos/400/300?random=${i + 1}`,
    placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3C/svg%3E'
  }));

  return (
    <div className="page">
      <h2>🖼️ 图片懒加载示例</h2>
      <p>滚动页面，观察图片按需加载（打开 Network 面板查看）</p>

      <div className="image-grid">
        {images.map((image, index) => (
          <div key={image.id} className="image-item">
            <img
              ref={el => imageRefs.current[index] = el}
              data-src={image.src}
              src={image.placeholder}
              alt={`Image ${image.id}`}
              className="lazy-image"
            />
            <p>图片 #{image.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageLazy;

