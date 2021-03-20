# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :disposocial,
  ecto_repos: [Disposocial.Repo]

# Configures the endpoint
config :disposocial, DisposocialWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "43h5EPxLdxZS4CH1Lo+2fl5P5qmrbLvppXn/K+NpbrBzw4UTjQ3whxQxqi3kXKJS",
  render_errors: [view: DisposocialWeb.ErrorView, accepts: ~w(json), layout: false],
  pubsub_server: Disposocial.PubSub,
  live_view: [signing_salt: "WqsasT7b"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
