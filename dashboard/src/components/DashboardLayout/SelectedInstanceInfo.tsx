import { useMemo } from 'react';
import { RadioGroup } from '@headlessui/react';
import { InstanceContext } from 'data/InstanceContext';
import { useContext, useEffect } from 'react';
import useAnalyticsEventTracker from 'utils/hooks';
import clsx from 'clsx';
import { BrowserLocationContext } from 'data/BrowserLocationContext';
import InstanceCard from 'components/InstanceCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { tabs } from 'pages/InstanceTabs/InstanceTabs';
import { useQueryClient } from '@tanstack/react-query';
import { GlobalSettingsData } from 'bindings/GlobalSettingsData';

export const SelectedInstanceInfo = ({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const {
    instanceList: instances,
    selectedInstance,
    isReady,
  } = useContext(InstanceContext);

  const gaEventTracker = useAnalyticsEventTracker('Instance List');
  const { setPathname } = useContext(BrowserLocationContext);
  const setActive = useMemo(() => location.pathname.split('/')[2], [location.pathname]);
  const queryClient = useQueryClient();
  const globalSettings = queryClient.getQueryData<GlobalSettingsData>(['global_settings']);
  console.log(globalSettings)

  useEffect(() => {
    if (!isReady) return;
    gaEventTracker(
      'View',
      'Instance List',
      true,
      Object.keys(instances).length
    );
  }, [isReady, instances]);

  const uuid = selectedInstance?.uuid;
  if (!selectedInstance || !uuid) {
    return (
      <div className="text-gray-faded/30 mx-1 px-1">
        <div className="text-small text-gray-faded/30 font-bold leading-snug">
          SELECTED INSTANCE
        </div>
        <div className="text-gray-faded/30 mt-2 flex h-[17.625rem] justify-center rounded-md border border-dashed text-center">
          <div className="mt-20 w-[5.5rem]">
            <div className="text-h1">
              <FontAwesomeIcon icon={faExpand} />
            </div>
            <div className="text-medium mt-2 font-bold">
              Any selected instance will appear here
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RadioGroup
      className={`child:w-full mx-1 flex min-h-0 flex-col gap-y-1 overflow-x-hidden px-1 pb-1 ${className}`}
      onChange={setPathname}
    >
      <RadioGroup.Label className="text-small text-gray-faded/30 font-bold leading-snug">
        SELECTED INSTANCE
      </RadioGroup.Label>

      <InstanceCard {...selectedInstance} />

      {selectedInstance &&
        tabs.map((tab) => (
          (tab.title !== 'Playitgg' || globalSettings?.playit_enabled) &&
          <RadioGroup.Option
            key={tab.path}
            value={`/dashboard/${tab.path}`}
            className="child:w-full rounded-md outline-none focus-visible:bg-gray-800"
          >
            <button
              className={clsx(
                'flex flex-row items-center gap-x-1.5',
                'cursor-pointer rounded-md px-2 py-1',
                'text-medium font-medium leading-5 tracking-normal',
                'hover:bg-gray-800',
                'focus-visible:ring-blue-faded/50 focus-visible:outline-none focus-visible:ring-4',
                setActive === tab.path
                  ? 'outline-fade-700 bg-gray-800 outline outline-1'
                  : ''
              )}
              onClick={() => setPathname(`/dashboard/${tab.path}`)}
            >
              <div
                className={clsx(
                  setActive === tab.path
                    ? 'text-white/50'
                    : 'text-gray-faded/30'
                )}
              >
                {tab.icon}
              </div>
              <div className="text-gray-300">{tab.title}</div>
            </button>
          </RadioGroup.Option>
        ))}
      {children}
    </RadioGroup>
  );
};
