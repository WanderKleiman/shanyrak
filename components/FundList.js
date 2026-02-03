function FundList({ onEdit }) {
  try {
    const [funds, setFunds] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const loadFunds = async () => {
      try {
        setIsLoading(true);
        const result = await trickleListObjects('partner_fund', 50, true);
        setFunds(result.items);
      } catch (error) {
        console.error('Error loading funds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    React.useEffect(() => {
      loadFunds();
    }, []);

    const handleDelete = async (fund) => {
      if (confirm('Вы уверены, что хотите удалить этот фонд?')) {
        try {
          await trickleDeleteObject('partner_fund', fund.objectId);
          await loadFunds();
        } catch (error) {
          alert('Ошибка при удалении');
        }
      }
    };

    if (isLoading) {
      return (
        <div className="card text-center py-8">
          <div className="icon-loader text-2xl text-[var(--primary-color)] animate-spin mx-auto mb-2"></div>
          <p>Загрузка фондов...</p>
        </div>
      );
    }

    if (funds.length === 0) {
      return (
        <div className="card text-center py-8">
          <div className="icon-building text-3xl text-gray-400 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium mb-2">Нет фондов</h3>
          <p className="text-[var(--text-secondary)]">Пока нет добавленных фондов-партнеров</p>
        </div>
      );
    }

    return (
      <div className="space-y-4" data-name="fund-list" data-file="components/FundList.js">
        {funds.map(fund => {
          const data = fund.objectData;
          
          return (
            <div key={fund.objectId} className="card">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={data.logo_url}
                    alt={data.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  {data.is_verified && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--success-color)] rounded-full flex items-center justify-center">
                      <div className="icon-check text-xs text-white"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{data.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-2">
                    {data.description}
                  </p>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Создан: {new Date(data.created_at).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(fund)}
                    className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200"
                  >
                    <div className="icon-edit text-sm"></div>
                  </button>
                  <button
                    onClick={() => handleDelete(fund)}
                    className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                  >
                    <div className="icon-trash text-sm"></div>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  } catch (error) {
    console.error('FundList component error:', error);
    return null;
  }
}