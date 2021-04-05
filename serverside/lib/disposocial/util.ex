defmodule Disposocial.Util do
  require Logger

  def stringify_keys(amap) do
    for {k, v} <- amap, into: %{}, do: {to_string(k), v}
  end

  def convertUTC!(dateTime) do
    DateTime.shift_zone!(dateTime, "America/Chicago")
  end

  def escapeInput(inputStr), do: Phoenix.HTML.Safe.to_iodata(inputStr)

end
