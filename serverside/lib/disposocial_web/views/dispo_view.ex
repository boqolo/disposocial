defmodule DisposocialWeb.DispoView do
  use DisposocialWeb, :view
  alias DisposocialWeb.DispoView

  def render("index.json", %{dispos: dispos}) do
    %{data: render_many(dispos, DispoView, "dispo.json")}
  end

  def render("show.json", %{dispo: dispo}) do
    %{data: render_one(dispo, DispoView, "dispo.json")}
  end

  def render("dispo.json", %{dispo: dispo}) do
    %{id: dispo.id,
      name: dispo.name,
      location: dispo.location,
      death: dispo.death}
  end
end
