import { Globe, Compass, Heart } from '@phosphor-icons/react';

const ICON_MAP = {
  overview: Globe,
  explore: Compass,
  memories: Heart,
};

export default function Navigation({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-50 dark:bg-ink/90 dark:border-gray-700">
      <div className="max-w-2xl mx-auto flex">
        {tabs.map(tab => {
          const Icon = ICON_MAP[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 pt-3 text-xs transition-colors ${
                activeTab === tab.id
                  ? 'text-sakura font-semibold'
                  : 'text-warm-gray'
              }`}
            >
              <Icon
                size={22}
                weight={activeTab === tab.id ? 'duotone' : 'regular'}
                className="mb-0.5"
              />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
