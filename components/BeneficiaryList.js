function BeneficiaryList({ city, onEdit, onAddReport, statusFilter = 'active' }) {
  try {
    const [beneficiaries, setBeneficiaries] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const loadBeneficiaries = async () => {
      try {
        setIsLoading(true);
        const result = await trickleListObjects('charity_beneficiary', 50, true);
        const filtered = result.items.filter(item => {
          const matchesCity = item.objectData.city === city;
          const status = item.objectData.collection_status || 'active';
          const matchesStatus = status === statusFilter;
          return matchesCity && matchesStatus;
        });
        setBeneficiaries(filtered);
      } catch (error) {
        console.error('Error loading beneficiaries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    React.useEffect(() => {
      loadBeneficiaries();
    }, [city]);

    const handleComplete = async (beneficiary) => {
      if (confirm('Подтвердите завершение сбора средств для этого подопечного')) {
        try {
          await trickleUpdateObject('charity_beneficiary', beneficiary.objectId, {
            ...beneficiary.objectData,
            collection_status: 'completed',
            completion_date: new Date().toISOString(),
            is_active: false
          });
          await loadBeneficiaries();
        } catch (error) {
          alert('Ошибка при завершении сбора');
        }
      }
    };

    const handleDelete = async (beneficiary) => {
      if (confirm('Вы уверены, что хотите удалить этого подопечного?')) {
        try {
          await trickleDeleteObject('charity_beneficiary', beneficiary.objectId);
          await loadBeneficiaries();
        } catch (error) {
          alert('Ошибка при удалении');
        }
      }
    };

    const getCategoryName = (category) => {
      const categories = {
        children: 'Дети',
        urgent: 'Срочные',
        operations: 'Операции',
        animals: 'Животные',
        social: 'Социальные программы',
        non_material: 'Не материальная помощь'
      };
      return categories[category] || category;
    };

    if (isLoading) {
      return (
        <div className="card text-center py-8">
          <div className="icon-loader text-2xl text-[var(--primary-color)] animate-spin mx-auto mb-2"></div>
          <p>Загрузка подопечных...</p>
        </div>
      );
    }

    if (beneficiaries.length === 0) {
      return (
        <div className="card text-center py-8">
          <div className="icon-users text-3xl text-gray-400 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium mb-2">Нет подопечных</h3>
          <p className="text-[var(--text-secondary)]">В городе {city} пока нет добавленных подопечных</p>
        </div>
      );
    }

    return (
      <div className="space-y-4" data-name="beneficiary-list" data-file="components/BeneficiaryList.js">
        {beneficiaries.map(beneficiary => {
          const data = beneficiary.objectData;
          const progressPercentage = (data.raised_amount / data.target_amount) * 100;
          
          return (
            <div key={beneficiary.objectId} className="card">
              <div className="flex space-x-4">
                <img 
                  src={data.image_url}
                  alt={data.title}
                  className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{data.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {getCategoryName(data.category)}
                        </span>
                        <span>{data.partner_fund}</span>
                        {data.is_urgent && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">Срочно</span>
                        )}
                        {!data.is_active && (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Неактивен</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {statusFilter === 'active' && (
                        <button
                          onClick={() => handleComplete(beneficiary)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200"
                        >
                          Сбор завершен
                        </button>
                      )}
                      {statusFilter === 'completed' && onAddReport && (
                        <button
                          onClick={() => onAddReport(beneficiary)}
                          className="px-3 py-1 bg-[var(--primary-color)] text-white rounded-full text-sm font-medium hover:opacity-90"
                        >
                          Добавить отчет
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(beneficiary)}
                        className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200"
                      >
                        <div className="icon-edit text-sm"></div>
                      </button>
                      <button
                        onClick={() => handleDelete(beneficiary)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                      >
                        <div className="icon-trash text-sm"></div>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                    {data.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Прогресс сбора</span>
                      <span className="font-medium">
                        {data.raised_amount?.toLocaleString()} ₽ / {data.target_amount?.toLocaleString()} ₽
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[var(--primary-color)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-xs text-[var(--text-secondary)]">
                      {progressPercentage.toFixed(1)}% от цели
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  } catch (error) {
    console.error('BeneficiaryList component error:', error);
    return null;
  }
}