function SponsorForm({ sponsor, onClose }) {
  try {
    const [formData, setFormData] = React.useState({
      name: sponsor?.objectData?.name || '',
      description: sponsor?.objectData?.description || '',
      logo_url: sponsor?.objectData?.logo_url || '',
      total_donated: sponsor?.objectData?.total_donated || 0,
      is_verified: sponsor?.objectData?.is_verified !== false
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        if (sponsor) {
          await trickleUpdateObject('company_profile', sponsor.objectId, formData);
        } else {
          await trickleCreateObject('company_profile', formData);
        }
        onClose();
        window.location.reload();
      } catch (error) {
        alert('Ошибка при сохранении данных');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--bg-primary)] rounded-[var(--card-radius)] p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {sponsor ? 'Редактировать спонсора' : 'Добавить спонсора'}
            </h2>
            <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="icon-x text-sm"></div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название компании</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="form-input h-20 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL логотипа</label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => handleChange('logo_url', e.target.value)}
                className="form-input"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Общая сумма помощи (₸)</label>
              <input
                type="number"
                value={formData.total_donated}
                onChange={(e) => handleChange('total_donated', parseInt(e.target.value) || 0)}
                className="form-input"
              />
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_verified}
                onChange={(e) => handleChange('is_verified', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Верифицированная компания</span>
            </label>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1"
              >
                {isLoading ? 'Сохранение...' : (sponsor ? 'Обновить' : 'Создать')}
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
    console.error('SponsorForm component error:', error);
    return null;
  }
}