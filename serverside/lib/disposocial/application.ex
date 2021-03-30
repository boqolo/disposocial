defmodule Disposocial.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Disposocial.Repo,
      # Start the Telemetry supervisor
      DisposocialWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Disposocial.PubSub},
      # Start the Endpoint (http/https)
      DisposocialWeb.Endpoint,
      # Start random id generator process
      Disposocial.RandomWords,
      # Start Phoenix presence
      DisposocialWeb.Presence
      # Start a worker by calling: Disposocial.Worker.start_link(arg)
      # {Disposocial.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Disposocial.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    DisposocialWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
