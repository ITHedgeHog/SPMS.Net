﻿using System.Collections.Generic;
using SPMS.Common.ViewModels;

namespace SPMS.Application.Dtos
{
    public class PlayerEditViewModel : SPMS.Common.ViewModels.BaseViewModel
    {
        public int Id { get; set; }

        public string DisplayName { get; set; }

        public string AuthString { get; set; }

        public List<PlayerRoleDto> Roles { get; set; }
    }
}
