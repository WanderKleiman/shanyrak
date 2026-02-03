function ReportForm({ beneficiary, onClose }) {
  try {
    const [formData, setFormData] = React.useState({
      report_photos: beneficiary?.objectData?.report_photos?.join('\n') || '',
      report_videos: beneficiary?.objectData?.report_videos?.join('\n') || '',
      report_description: beneficiary?.objectData?.report_description || ''
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const processedData = {
          ...beneficiary.objectData,
          report_photos: formData.report_photos ? formData.report_photos.split('\n').filter(url => url.trim()) : [],
          report_videos: formData.report_videos ? formData.report_videos.split('\n').filter(url => url.trim()) : [],
          report_description: formData.report_description,
          collection_status: 'reported'
        };

        await trickleUpdateObject('charity_beneficiary', beneficiary.objectId, processedData);
        clearCache('beneficiaries');
        clearCache('reports');
        onClose();
        window.location.reload();
      } catch (error) {
        alert('Ошибка при сохранении отчета');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--bg-primary)] rounded-[var(--card-radius)] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Добавить отчет: {beneficiary.objectData.title}</h2>
            <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="icon-x text-sm"></div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Фотографии отчета (по одной на строку)</label>
              <textarea
                value={formData.report_photos}
                onChange={(e) => handleChange('report_photos', e.target.value)}
                className="form-input h-24 resize-none"
                placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Видео отчета (YouTube ссылки, по одной на строку)</label>
              <textarea
                value={formData.report_videos}
                onChange={(e) => handleChange('report_videos', e.target.value)}
                className="form-input h-24 resize-none"
                placeholder="https://www.youtube.com/watch?v=example1&#10;https://www.youtube.com/watch?v=example2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Описание оказанной помощи</label>
              <textarea
                value={formData.report_description}
                onChange={(e) => handleChange('report_description', e.target.value)}
                className="form-input h-32 resize-none"
                placeholder="Опишите, какая помощь была оказана..."
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1"
              >
                {isLoading ? 'Сохранение...' : 'Отправить отчет'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ReportForm component error:', error);
    return null;
  }
}