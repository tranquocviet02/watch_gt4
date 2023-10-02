using LandingBank.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LandingBank.Controllers
{
    public class BKCustomerController : Controller
    {
        private DBContextBank db = new DBContextBank();

        public ActionResult Index()
        {
            try
            {
                //var listBank = new DBContextBank().Clients.FirstOrDefault();
                var listBank = new DBContextBank().Clients.ToList();
                return View(listBank);
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        public ActionResult Index1()
        {
            return View();
        }

        public ActionResult Index2()
        {
            return View();
        }

        // GET: BKCustomer
        [HttpGet]
        public ActionResult AddOrUpdate(int id = 0)
        {
            var client = new Client();
            if (id != 0)
            {
                return View(db.Clients.Find(id));
            }
            return View(client);
        }

        [HttpPost]
        public ActionResult AddOrUpdate(Client client)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (client.id == 0)
                    {
                        db.Clients.Add(client);
                    }
                    else
                    {
                        db.Entry(client).State = EntityState.Modified;
                        // đánh dâu kh đã sửa đổi
                        var data = db.Clients.Find(client.id);

                        data.UserName = client.UserName;
                        data.PhoneNumber = client.PhoneNumber;
                        data.Adress = client.Adress;
                        data.ReferralCode = client.ReferralCode;
                        db.Clients.Attach(data);
                    }
                    client.dateTime0 = DateTime.Now;
                    db.SaveChanges();
                }
                return RedirectToAction("index");
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}