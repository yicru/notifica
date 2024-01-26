import useSWR from 'swr'
import { Notification } from '../../shared/types'

const TARGET_APP_IDS = [
  'com.tinyspeck.slackmacgap',
  'com.electron.chatwork',
  'com.microsoft.teams2',
  'com.hnc.Discord',
]

export default function App() {
  const { data } = useSWR<Notification[]>(
    '/notifications',
    () => {
      return window.electron.ipcRenderer.invoke('get-notifications')
    },
    {
      refreshInterval: 1000,
    },
  )

  const groupedByApp = data
    ?.filter((notification) => {
      return TARGET_APP_IDS.includes(notification.app)
    })
    .reduce(
      (acc, notification) => {
        if (!acc[notification.app]) {
          acc[notification.app] = []
        }

        acc[notification.app].push(notification)

        return acc
      },
      {} as Record<string, Notification[]>,
    )

  return (
    <div className={'p-10'}>
      <div className={'flex justify-start items-start gap-4'}>
        {Object.entries(groupedByApp ?? []).map(([app, notifications]) => (
          <div key={app} className={'min-w-96'}>
            <div className={'font-medium text-sm'}>{app}</div>
            <div className={'space-y-4 mt-4'}>
              {notifications.map((notification, index) => (
                <div
                  key={`${notification.title}_${index}`}
                  className={'bg-neutral-100 p-4 rounded-xl'}
                >
                  <img
                    src={`https://itunes.apple.com/lookup?bundleId=${notification.app}`}
                    alt=""
                  />
                  <p className={'text-sm font-medium'}>{notification.title}</p>
                  <p className={'text-xs font-medium mt-1'}>
                    {notification.subtitle}
                  </p>
                  <p className={'text-xs mt-2'}>{notification.body}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
