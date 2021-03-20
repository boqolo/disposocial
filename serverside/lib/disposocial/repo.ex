defmodule Disposocial.Repo do
  use Ecto.Repo,
    otp_app: :disposocial,
    adapter: Ecto.Adapters.Postgres
end
