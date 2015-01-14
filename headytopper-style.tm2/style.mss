Map {
  background-color: #fff;
}

#headytopper-locations {
  [type="store"] {
    marker-width: 5px;
    [deliveryDate="Monday"] { marker-fill:red; }
    [deliveryDate="Tuesday"] { marker-fill:blue; }
    [deliveryDate="Wednesday"] { marker-fill:green; }
    [deliveryDate="Thursday"] { marker-fill:yellow; }
    [deliveryDate="Friday"] { marker-fill:purple; }
    [deliveryDate="Tuesday Thursday"] { marker-fill:pink; }
  }
}


