function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navbar Superior */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">☀️</div>
            <h1 className="text-2xl font-bold">CLIMA</h1>
          </div>

          {/* Menu de Navegação */}
          <nav className="flex items-center gap-2">
            <button className="rounded-lg bg-accent px-6 py-2 font-medium transition hover:opacity-90">
              📊 Overview
            </button>
            <button className="rounded-lg px-6 py-2 font-medium transition hover:bg-primary-light">
              ☀️ Forecasts
            </button>
            <button className="rounded-lg px-6 py-2 font-medium transition hover:bg-primary-light">
              📈 Detailing
            </button>
            <button className="rounded-lg px-6 py-2 font-medium transition hover:bg-primary-light">
              🔔 Alerts
            </button>
            <button className="rounded-lg px-6 py-2 font-medium transition hover:bg-primary-light">
              ⚙️ Settings
            </button>
          </nav>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">°C/°F</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-light">
                <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white transition" />
              </button>
            </div>
            <span className="text-sm font-medium">ENG</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Cards de Localização */}
        <div className="mb-8 flex gap-4">
          <div className="flex items-center gap-3 rounded-lg bg-card px-6 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info text-xl">
              H
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thu, June 19 - 12 PM</p>
              <p className="font-semibold text-foreground">Hrodna</p>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <span className="text-2xl">☀️</span>
              <span className="text-2xl font-bold text-foreground">+25°C</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-card px-6 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info text-xl">
              L
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thu, June 19 - 10 AM</p>
              <p className="font-semibold text-foreground">London</p>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <span className="text-2xl">🌤️</span>
              <span className="text-2xl font-bold text-foreground">+20°C</span>
            </div>
          </div>
        </div>

        {/* Grid de Cards Principais */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Card de Temperatura Detalhada */}
          <div className="rounded-lg bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Hrodna</h2>
              <p className="text-sm text-muted-foreground">Thu, June 19, 12 PM</p>
            </div>

            <div className="mb-4 flex items-center justify-center gap-4">
              <span className="text-7xl">☀️</span>
              <span className="text-7xl font-bold text-foreground">+25°C</span>
            </div>

            <div className="mb-6 text-center">
              <p className="text-muted-foreground">Feels like +28°C</p>
              <p className="font-medium text-warning">Sunny</p>
              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-info">
                <span>⚠️</span>
                High UV level, use SPF protection!
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-lg bg-secondary p-4 text-center">
                <div className="text-2xl font-bold text-foreground">6</div>
                <div className="text-xs text-muted-foreground">UV</div>
              </div>
              <div className="rounded-lg bg-secondary p-4 text-center">
                <div className="text-2xl font-bold text-foreground">35%</div>
                <div className="text-xs text-muted-foreground">Humidity</div>
              </div>
              <div className="rounded-lg bg-secondary p-4 text-center">
                <div className="text-2xl font-bold text-foreground">5 m/s</div>
                <div className="text-xs text-muted-foreground">Wind speed</div>
              </div>
              <div className="rounded-lg bg-secondary p-4 text-center">
                <div className="text-2xl font-bold text-foreground">+20°C</div>
                <div className="text-xs text-muted-foreground">Water</div>
              </div>
            </div>
          </div>

          {/* Card de Gráfico de Temperatura */}
          <div className="rounded-lg bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Temperature (Hrodna)</h2>
              <select className="rounded-lg border border-border bg-background px-3 py-1 text-sm text-foreground">
                <option>June</option>
                <option>July</option>
                <option>August</option>
              </select>
            </div>
            <div className="h-64 rounded-lg bg-secondary/30 p-4">
              <div className="flex h-full items-end justify-between gap-2">
                {[22, 24, 23, 25, 27, 26, 25, 24].map((temp, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div 
                      className="w-full rounded-t-lg bg-info/60"
                      style={{ height: `${(temp / 30) * 100}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{temp}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card de Previsão Semanal */}
          <div className="rounded-lg bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Weekly forecast (London)</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { day: 'Fri', date: 'June 20', icon: '☀️', temp: '+20°C' },
                { day: 'Sat', date: 'June 21', icon: '🌤️', temp: '+31°C' },
                { day: 'Sun', date: 'June 22', icon: '🌧️', temp: '+26°C' },
                { day: 'Mon', date: 'June 23', icon: '🌦️', temp: '+23°C' },
                { day: 'Tue', date: 'June 24', icon: '🌤️', temp: '+24°C' },
                { day: 'Wed', date: 'June 25', icon: '🌧️', temp: '+27°C' },
              ].map((forecast, i) => (
                <div key={i} className="rounded-lg border border-border p-4 text-center">
                  <p className="font-semibold text-foreground">{forecast.day}</p>
                  <p className="text-xs text-muted-foreground">{forecast.date}</p>
                  <div className="my-2 text-3xl">{forecast.icon}</div>
                  <p className="font-bold text-foreground">{forecast.temp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card de Mapa de Precipitação */}
          <div className="rounded-lg bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Precipitation Map (United Kingdom)</h2>
              <p className="text-sm text-muted-foreground">Thu, June 19, 10 AM</p>
            </div>
            <div className="flex h-64 items-center justify-center rounded-lg bg-secondary/30">
              <p className="text-muted-foreground">🗺️ Map placeholder</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Precipitation, mm/Hg</span>
              <div className="flex items-center gap-2">
                <span className="text-xs">0.5</span>
                <div className="h-2 w-32 rounded-full bg-gradient-to-r from-warning/30 to-warning"></div>
                <span className="text-xs">25</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
