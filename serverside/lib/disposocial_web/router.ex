defmodule DisposocialWeb.Router do
  use DisposocialWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  scope "/api/v1", DisposocialWeb do
    pipe_through(:api)
    # FIXME conflicting routes
    post "/dispos/near", DispoController, :get_near

    resources("/session", SessionController, only: [:create])
    resources("/dispos", DispoController, except: [:new, :edit, :index])
    resources("/users", UserController, except: [:new, :edit])
    # resources("/posts", PostController, except: [:new, :edit])
    # resources("/tags", TagController, except: [:new, :edit])
    # resources("/reactions", ReactionController, except: [:new, :edit])
    # resources "/comments", CommentController, except: [:new, :edit]
  end

  scope "/", DisposocialWeb do
    pipe_through(:browser)

    # get("/", RootController, :index)
    get("/photos", RootController, :photo)
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through([:fetch_session, :protect_from_forgery])
      live_dashboard("/dashboard", metrics: DisposocialWeb.Telemetry)
    end
  end
end
