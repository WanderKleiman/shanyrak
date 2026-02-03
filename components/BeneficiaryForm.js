function BeneficiaryForm({ city, beneficiary, onClose }) {
  try {
    const [formData, setFormData] = React.useState({
      title: beneficiary?.objectData?.title || '',
      description: beneficiary?.objectData?.description || '',
      category: beneficiary?.objectData?.category || 'children',
      city: beneficiary?.objectData?.city || city,
      partner_fund: beneficiary?.objectData?.partner_fund || 'Шанырак',
      target_amount: beneficiary?.objectData?.target_amount || '',
      raised_amount: beneficiary?.objectData?.raised_amount || 0,
      image_url: beneficiary?.objectData?.image_url || '',
      images: beneficiary?.objectData?.images?.join('\n') || '',
      videos: beneficiary?.objectData?.videos?.join('\n') || '',
      helpers_count: beneficiary?.objectData?.helpers_count || '',
      documents_link: beneficiary?.objectData?.documents_link || '',
      is_active: beneficiary?.objectData?.is_active !== false,
      is_urgent: beneficiary?.objectData?.is_urgent || false,
      is_nationwide: beneficiary?.objectData?.is_nationwide || false,
      collection_status: beneficiary?.objectData?.collection_status || 'active'
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const categories = [
      { value: 'children', label: 'Дети' },
      { value: 'urgent', label: 'Срочные' },
      { value: 'operations', label: 'Операции' },
      { value: 'animals', label: 'Животные' },
      { value: 'social', label: 'Социальные программы' },
      { value: 'non_material', label: 'Не материальная помощь' }
    ];

    const [partnerFunds, setPartnerFunds] = React.useState([]);

    React.useEffect(() => {
      loadPartnerFunds();
    }, []);

    const loadPartnerFunds = async () => {
      try {
        const result = await trickleListObjects('partner_fund', 50, true);
        const funds = result.items.map(item => item.objectData.name);
        setPartnerFunds(funds);
      } catch (error) {
        console.error('Error loading partner funds:', error);
        setPartnerFunds(['Шанырак']); // Fallback
      }
    };

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const processedData = {
          ...formData,
          images: formData.images ? formData.images.split('\n').filter(url => url.trim()) : [],
          videos: formData.videos ? formData.videos.split('\n').filter(url => url.trim()) : []
        };

        if (beneficiary) {
          await trickleUpdateObject('charity_beneficiary', beneficiary.objectId, processedData);
        } else {
          await trickleCreateObject('charity_beneficiary', processedData);
        }
        clearCache('beneficiaries');
        clearCache('fund_beneficiaries');
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
        <div 
          className="bg-[var(--bg-primary)] rounded-[var(--card-radius)] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          data-name="beneficiary-form" 
          data-file="components/BeneficiaryForm.js"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {beneficiary ? 'Редактировать подопечного' : 'Добавить подопечного'}
            </h2>
            <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="icon-x text-sm"></div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Заголовок</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="form-input h-24 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="form-select"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Город</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Фонд-партнер</label>
              <select
                value={formData.partner_fund}
                onChange={(e) => handleChange('partner_fund', e.target.value)}
                className="form-select"
              >
                {partnerFunds.map(fund => (
                  <option key={fund} value={fund}>{fund}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Целевая сумма (₽)</label>
                <input
                  type="number"
                  value={formData.target_amount}
                  onChange={(e) => handleChange('target_amount', parseInt(e.target.value) || 0)}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Собранная сумма (₽)</label>
                <input
                  type="number"
                  value={formData.raised_amount}
                  onChange={(e) => handleChange('raised_amount', parseInt(e.target.value) || 0)}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL основного изображения</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                className="form-input"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Дополнительные изображения (по одному на строку)</label>
              <textarea
                value={formData.images}
                onChange={(e) => handleChange('images', e.target.value)}
                className="form-input h-20 resize-none"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Видео (YouTube ссылки, по одной на строку)</label>
              <textarea
                value={formData.videos}
                onChange={(e) => handleChange('videos', e.target.value)}
                className="form-input h-20 resize-none"
                placeholder="https://www.youtube.com/watch?v=example1&#10;https://www.youtube.com/watch?v=example2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Количество помощников</label>
              <input
                type="text"
                value={formData.helpers_count}
                onChange={(e) => handleChange('helpers_count', e.target.value)}
                className="form-input"
                placeholder="Например: 15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Документы, подтверждающие сбор (ссылка)</label>
              <input
                type="url"
                value={formData.documents_link}
                onChange={(e) => handleChange('documents_link', e.target.value)}
                className="form-input"
                placeholder="https://example.com/documents"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Ссылка откроется в новом окне для пользователей
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Активный проект</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_urgent}
                  onChange={(e) => handleChange('is_urgent', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Срочный проект</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_nationwide}
                  onChange={(e) => handleChange('is_nationwide', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Показывать во всех городах</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1"
              >
                {isLoading ? 'Сохранение...' : (beneficiary ? 'Обновить' : 'Создать')}
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
    console.error('BeneficiaryForm component error:', error);
    return null;
  }
}