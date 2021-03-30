defmodule DisposocialWeb.DispoView do
  use DisposocialWeb, :view
  alias DisposocialWeb.DispoView
  alias DisposocialWeb.ErrorHelpers
  alias Disposocial.Util

  require Logger

  def render("index.json", %{dispos: dispos}) do
    %{data: render_many(dispos, DispoView, "dispo.json")}
  end

  def render("show.json", %{dispo: dispo}) do
    %{data: render_one(dispo, DispoView, "dispo.json")}
  end

  def render("dispo.json", %{dispo: dispo}) do
    %{id: dispo.id,
      name: dispo.name,
      created: Util.convertUTC!(dispo.inserted_at),
      is_public: dispo.is_public,
      location: dispo.location,
      latitude: dispo.latitude,
      longitude: dispo.longitude,
      death: dispo.death}
  end

  def render("one_error.json", %{msgs: msgs}) do
    %{error: [ErrorHelpers.stringify(msgs)]}
  end
end
