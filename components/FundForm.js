function FundForm({ fund, onClose }) {
  try {
    const [formData, setFormData] = React.useState({
      name: fund?.objectData?.name || '',
      description: fund?.objectData?.description || '',
      logo_url: fund?.objectData?.logo_url || '',
      is_verified: fund?.objectData?.is_verified !== false
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
          ...formData,
          created_at: fund?.objectData?.created_at || new Date().toISOString()
        };

        if (fund) {
          await trickleUpdateObject('partner_fund', fund.objectId, processedData);
        } else {
          await trickleCreateObject('partner_fund', processedData);
        }
        clearCache('partner_funds');
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
              {fund ? 'Редактировать фонд' : 'Добавить фонд'}
            </h2>
            <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="icon-x text-sm"></div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название фонда</label>
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
              <label className="block text-sm font-medium mb-2">Логотип фонда</label>
              <div className="space-y-3">
                {formData.logo_url && (
                  <div className="flex items-center space-x-3">
                    <img 
                      src={formData.logo_url} 
                      alt="Логотип"
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => handleChange('logo_url', '')}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Удалить
                    </button>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => handleChange('logo_url', e.target.value)}
                    className="form-input flex-1"
                    placeholder="https://example.com/logo.png"
                  />
                  <a 
                    href="/upload_assets" 
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 whitespace-nowrap"
                  >
                    Загрузить
                  </a>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Вставьте URL изображения или загрузите файл
                </p>
              </div>
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_verified}
                onChange={(e) => handleChange('is_verified', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Верифицированный фонд</span>
            </label>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1"
              >
                {isLoading ? 'Сохранение...' : (fund ? 'Обновить' : 'Создать')}
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
    console.error('FundForm component error:', error);
    return null;
  }
}