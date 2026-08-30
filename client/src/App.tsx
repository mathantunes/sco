import { useSession } from './providers/SessionProvider'
import { Idle } from './components/Idle'
import { OrderComplete } from './components/OrderComplete'
import { Shopping } from './components/Shopping'

function App() {
  const { deviceId, menu, order } = useSession()

  switch (order?.kind) {
    case 'open':
      return <Shopping deviceId={deviceId} menu={menu} order={order} />
    case 'paid':
      return <OrderComplete order={order} />
    default:
      return <Idle deviceId={deviceId} />
  }
}

export default App
