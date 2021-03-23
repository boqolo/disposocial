defmodule DisposocialWeb.Util do
  def escape_string(str) do
    {_, iodata} = Phoenix.HTML.html_escape(str)
    IO.iodata_to_binary(iodata)
  end
end
