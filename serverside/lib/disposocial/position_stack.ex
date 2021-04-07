defmodule Disposocial.PositionStack do
  @api_base "http://api.positionstack.com/v1"

  def get_location_by_coords(lat, lng) do
    api_key = System.fetch_env!("PSTACK_KEY")
    access_str = "access_key=#{api_key}"
    query_str = "query=#{to_string(lat)},#{to_string(lng)}"
    url = "#{Path.join(@api_base, "reverse")}?#{access_str}&#{query_str}"
    resp = HTTPoison.get!(url)
    data =
      resp
      |> Map.get(:body)
      |> Jason.decode!()
      |> Map.get("data")

    unless Enum.count(data) == 0 do
      # we got data back
      # get the first because by default PositionStack results order
      # by decreasing confidence of the reverse geocoding results
      relevant = [
        "country_code",
        "region",
        "locality",
        "neighbourhood",
        "street",
        "postal_code"
      ]

      hd(data)
      |> Map.take(relevant)
    end
  end

end
