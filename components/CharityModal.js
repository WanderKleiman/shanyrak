function CharityModal({ data, onClose }) {
  try {
    const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
    
    const progressPercentage = (data.raised / data.target) * 100;
    const remainingAmount = data.target - data.raised;

    const media = [];
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => media.push({ type: 'image', url: image }));
    }
    if (data.videos && data.videos.length > 0) {
      data.videos.forEach(video => media.push({ type: 'video', url: video }));
    }

    const handleHelp = () => {
      window.location.href = `payment.html?id=${data.id}`;
    };

    const handleShare = () => {
      const shareUrl = `${window.location.origin}${window.location.pathname}?beneficiary=${data.id}`;
      if (navigator.share) {
        navigator.share({ url: shareUrl }).catch(() => {
          navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Ссылка скопирована в буфер обмена');
          });
        });
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('Ссылка скопирована в буфер обмена');
        });
      }
    };

    const nextMedia = () => {
      setCurrentMediaIndex((prev) => (prev + 1) % media.length);
    };

    const prevMedia = () => {
      setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    const getVideoId = (url) => {
      const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center md:justify-center z-50 p-0 md:p-4" onClick={onClose}>
        <div 
          className="bg-[var(--bg-primary)] w-full md:w-auto md:max-w-[600px] rounded-t-3xl md:rounded-2xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center z-20 hover:bg-opacity-100 shadow-lg"
          >
            <div className="icon-x text-sm"></div>
          </button>

          <div className="flex flex-col">
            {media.length > 0 && media[currentMediaIndex] && (
              <div className="relative h-64 md:h-96">
                {media[currentMediaIndex].type === 'image' ? (
                  <img 
                    src={media[currentMediaIndex].url} 
                    alt={data.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 md:h-96 bg-black flex items-center justify-center">
                    {getVideoId(media[currentMediaIndex].url) ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getVideoId(media[currentMediaIndex].url)}`}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                      />
                    ) : (
                      <video 
                        src={media[currentMediaIndex].url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">{data.title}</h3>
              <p className="text-[var(--text-secondary)] mb-4">{data.description}</p>
              
              <div className="space-y-3 bg-[var(--bg-secondary)] p-4 rounded-xl mb-4">
                <div className="flex justify-between text-sm">
                  <span>Собрано</span>
                  <span className="font-semibold">
                    {data.raised.toLocaleString()} ₸ из {data.target.toLocaleString()} ₸
                  </span>
                </div>
                
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button onClick={handleHelp} className="btn-primary flex-1">
                  Помочь
                </button>
                <button onClick={handleShare} className="btn-secondary w-12 h-12 p-0">
                  <div className="icon-share-2 text-lg"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('CharityModal component error:', error);
    return null;
  }
}