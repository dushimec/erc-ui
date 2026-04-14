
import UpcomingEvents from '../components/Events'

import Hero from '../components/Hero'
import Sermons from '../components/Sermons'
import WelcomeSection from '../components/WelcomeSection'

function Home() {
  return (
    <div>
        <Hero/>
        <WelcomeSection/>
        <UpcomingEvents/>
        <Sermons/>
       
    </div>
  )
}

export default Home