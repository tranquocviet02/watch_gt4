﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LandingBank.Controllers
{
    public class BlackFridayController : Controller
    {
        // GET: BlackFriday
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Index_Mobile()
        {
            return View();
        }
    }
}