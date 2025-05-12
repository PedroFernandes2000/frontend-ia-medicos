import {ServiceStatus} from '../types'

interface StatusProps {
  status: ServiceStatus;
  setStatus: (isActive: boolean) => Promise<void> | void;
}

export const StatusComponent: React.FC<StatusProps> = ({
    status,
    setStatus
})=>{
    const handleToggleStatus = (newStatus: boolean) => {
        setStatus(newStatus);
    };
    return(
        <div className="relative inline-block w-12 h-6 align-middle select-none">
              <input
                type="checkbox"
                checked={status.isActive}
                onChange={(e) => handleToggleStatus(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`toggle-label block w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
                  status.isActive ? 'bg-green-400' : 'bg-gray-300'
                }`}
                onClick={() => handleToggleStatus(!status.isActive)}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
                    status.isActive ? 'translate-x-0' : 'translate-x-6'
                  }`}
                ></div>
              </div>
            </div>
    )
}