defmodule DisposocialWeb.DispoView do
  use DisposocialWeb, :view
  alias DisposocialWeb.DispoView
  alias DisposocialWeb.ErrorHelpers
  alias Disposocial.Util
  alias Disposocial.Dispos

  require Logger

  def render("index.json", %{dispos: dispos}) do
    %{data: render_many(dispos, DispoView, "dispo.json")}
  end

  def render("show.json", %{dispo: dispo}) do
    %{data: render_one(dispo, DispoView, "dispo.json")}
  end

  def render("dispo.json", %{dispo: dispo}) do
    Dispos.present(dispo)
  end

  def render("one_error.json", %{msgs: msgs}) do
    %{error: [ErrorHelpers.stringify(msgs)]}
  end
end
