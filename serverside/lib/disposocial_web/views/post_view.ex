defmodule DisposocialWeb.PostView do
  use DisposocialWeb, :view
  alias DisposocialWeb.PostView

  def render("index.json", %{posts: posts}) do
    %{data: render_many(posts, PostView, "post.json")}
  end

  def render("show.json", %{post: post}) do
    %{data: render_one(post, PostView, "post.json")}
  end

  def render("post.json", %{post: post}) do
    %{id: post.id,
      body: post.body,
      media_hash: post.media_hash}
  end
end
