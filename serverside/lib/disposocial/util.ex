defmodule Disposocial.Util do

  def stringify_keys(amap) do
    for {k, v} <- amap, into: %{}, do: {to_string(k), v}
  end

end
