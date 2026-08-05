import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette:{

        primary:{
            main:"#5B5CEB"
        },

        secondary:{
            main:"#7E7FFF"
        },

        background:{
            default:"#F5F7FB",
            paper:"#FFFFFF"
        }

    },

    typography:{

        fontFamily:"Inter, sans-serif"

    },

    shape:{

        borderRadius:18

    }

});

export default theme;