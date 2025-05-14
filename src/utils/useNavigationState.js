import { useNavigate, useLocation } from "react-router-dom"

export function useNavigationState() {
  const navigate = useNavigate()
  const location = useLocation()

  const navigateWithState = (to, fromPage) => {
    navigate(to, { state: { from: fromPage } })
  }

  const goBack = (defaultPath) => {
    if (location.state?.from) {
      navigate(location.state.from)
    } else {
      navigate(defaultPath)
    }
  }

  return { navigateWithState, goBack }
}
