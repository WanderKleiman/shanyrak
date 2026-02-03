function FundApp() {
  const [fundName, setFundName] = React.useState('');
  const [fundLogo, setFundLogo] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [charityData, setCharityData] = React.useState([]);
  const [selectedCharity, setSelectedCharity] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || 'Шанырак';
    setFundName(name);
    loadFundInfo(name);
    loadFundData(name);
  }, []);

  const loadFundInfo = async (fundName) => {
    try {
      const result = await trickleListObjects('partner_fund', 100, true);
      const fund = result.items.find(item => item.objectData.name === fundName);
      if (fund) {
        setFundLogo(fund.objectData.logo_url);
      }
    } catch (error) {
      console.error('Error loading fund info:', error);
    }
  };

  const loadFundData = async (fund) => {
    setIsLoading(true);
    try {
      // Check cache first
      const cached = getCachedData('fund_beneficiaries', { fund });
      if (cached) {
        setCharityData(cached);
        setIsLoading(false);
        return;
      }

      const result = await trickleListObjects('charity_beneficiary', 50, true);
      const fundData = result.items
        .filter(item => 
          item.objectData.partner_fund === fund 
          && item.objectData.is_active
        )
        .map(item => ({
          id: item.objectId,
          title: item.objectData.title,
          description: item.objectData.description,
          category: item.objectData.category,
          categoryName: getCategoryName(item.objectData.category),
          partnerFund: item.objectData.partner_fund,
          image: item.objectData.image_url,
          images: item.objectData.images || [item.objectData.image_url],
          videos: item.objectData.videos || [],
          helpersCount: item.objectData.helpers_count,
          raised: item.objectData.raised_amount || 0,
          target: item.objectData.target_amount || 0
        }));
      
      setCachedData('fund_beneficiaries', fundData, { fund });
      setCharityData(fundData);
    } catch (error) {
      console.error('Error loading fund data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = React.useMemo(() => {
    if (activeCategory === 'all') return charityData;
    return charityData.filter(item => item.category === activeCategory);
  }, [charityData, activeCategory]);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <header className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => window.history.back()}
            className="w-10 h-10 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center"
          >
            <div className="icon-arrow-left text-lg"></div>
          </button>
          {fundLogo && (
            <img 
              src={fundLogo}
              alt={fundName}
              className="w-12 h-12 object-cover rounded-xl"
            />
          )}
          <div>
            <h1 className="text-xl font-bold">Фонд "{fundName}"</h1>
            <p className="text-sm text-[var(--text-secondary)]">Подопечные фонда</p>
          </div>
        </div>
      </header>

      <div className="sticky top-0 bg-white bg-opacity-90 backdrop-blur-md z-10 pt-4 pb-2">
        <div className="px-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', name: 'Все', icon: 'grid-3x3' },
              { id: 'children', name: 'Дети', icon: 'baby' },
              { id: 'urgent', name: 'Срочные', icon: 'zap' },
              { id: 'operations', name: 'Операции', icon: 'activity' },
              { id: 'animals', name: 'Животные', icon: 'heart' },
              { id: 'social', name: 'Социальные программы', icon: 'users' },
              { id: 'non_material', name: 'Не материальная помощь', icon: 'hand-helping' }
            ].map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                  activeCategory === category.id 
                    ? 'bg-[var(--primary-color)] text-white' 
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-gray-100'
                }`}
              >
                <div className={`icon-${category.icon} text-sm`}></div>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 pb-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="icon-loader text-2xl text-[var(--primary-color)] animate-spin mx-auto mb-2"></div>
            <p className="text-[var(--text-secondary)]">Загрузка подопечных...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8">
            <div className="icon-users text-3xl text-gray-400 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Нет подопечных</h3>
            <p className="text-[var(--text-secondary)]">
              {activeCategory === 'all' 
                ? `У фонда "${fundName}" пока нет подопечных` 
                : `В категории "${getCategoryName(activeCategory)}" у фонда "${fundName}" пока нет подопечных`
              }
            </p>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredData.map(item => (
              <FundCharityCard 
                key={item.id}
                data={item}
                onCardClick={() => setSelectedCharity(item)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedCharity && (
        <CharityModal 
          data={selectedCharity}
          onClose={() => setSelectedCharity(null)}
        />
      )}
    </div>
  );
}

// Custom CharityCard for Fund Page with green button
function FundCharityCard({ data, onCardClick }) {
  const progressPercentage = (data.raised / data.target) * 100;
  const remainingAmount = data.target - data.raised;

  const handleHelp = () => {
    window.location.href = `payment.html?id=${data.id}`;
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/index.html?beneficiary=${data.id}`;
    if (navigator.share) {
      navigator.share({
        url: shareUrl
      }).catch(() => {
        // Если share API не сработал, копируем в буфер
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

  return (
    <div 
      className="bg-[var(--bg-primary)] rounded-[var(--card-radius)] p-4 shadow-[var(--card-shadow)] transition-transform duration-200 hover:scale-[1.02] cursor-pointer" 
      onClick={onCardClick}
    >
      <div className="relative mb-4">
        <img 
          src={data.image} 
          alt={data.title}
          className="w-full h-48 object-cover rounded-xl"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-[var(--primary-color)] text-white px-2 py-1 rounded-full text-xs font-medium">
            {data.categoryName}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-tight">
          {data.title}
        </h3>
        
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-4">
          {data.description}
        </p>
        
        <div className="flex items-center space-x-2 text-xs">
          <div className="icon-shield-check text-sm text-[var(--primary-color)]"></div>
          <a 
            href={`fund.html?name=${encodeURIComponent(data.partnerFund)}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[var(--primary-color)] hover:underline"
          >
            Фонд "{data.partnerFund}"
          </a>
        </div>
        
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Собрано</span>
              <span className="font-medium text-[var(--text-primary)]">
                {data.raised.toLocaleString()} ₸ из {data.target.toLocaleString()} ₸
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-[var(--primary-color)] transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-[var(--text-secondary)]">
              <span>Осталось собрать: {remainingAmount.toLocaleString()} ₸</span>
              {data.helpersCount && (
                <span>Помогли: {data.helpersCount} человек</span>
              )}
            </div>
          </div>
        
        <div className="flex space-x-3 pt-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleHelp();
            }}
            className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-[var(--button-radius)] font-medium transition-all duration-200 hover:opacity-90 active:scale-95 flex-1"
          >
            Помочь
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="bg-[var(--bg-primary)] text-[var(--primary-color)] w-12 h-12 rounded-[var(--button-radius)] font-medium border border-[var(--border-color)] transition-all duration-200 hover:bg-gray-50 active:scale-95 flex items-center justify-center p-0"
          >
            <div className="icon-share-2 text-lg"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('fund-root'));
root.render(<FundApp />);
